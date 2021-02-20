import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Account, AccountType} from "../../entities/account";
import { sprintf } from "sprintf";
import { User } from "../../entities/user";

export interface INewAccountRequest
{
    userId: number,
    balanceAmount: number,
    accountType: AccountType
}

export class AccountController {
    public static readonly BASIC_SAVINGS_MAX_BALANCE_AMOUNT = 50000;

    public static readonly BASIC_SAVINGS_BALANCE_AMOUNT_EXCEEDED = 
        "Balance amount for basic savings account cannot be greater than %(balanceAmount)s";

    private accountRepository = getRepository(Account);
    private userRepository = getRepository(User);

    public async all(request: Request, response: Response, next: NextFunction) {
        return this.accountRepository.find();
    }

    public async one(request: Request, response: Response, next: NextFunction) {
        return this.accountRepository.findOne(request.params.id);
    }

    public async save(request: Request, response: Response, next: NextFunction) {
        const accountDetails = request.body as INewAccountRequest;
        if (
            accountDetails.accountType === AccountType.BASIC_SAVINGS && 
            accountDetails.balanceAmount > AccountController.BASIC_SAVINGS_MAX_BALANCE_AMOUNT) {
            return response.status(500).json({ 
                message: sprintf(AccountController.BASIC_SAVINGS_BALANCE_AMOUNT_EXCEEDED, {
                        balanceAmount: AccountController.BASIC_SAVINGS_MAX_BALANCE_AMOUNT
                    })
                });
        }

        let user: User;
        try {
            user = await this.userRepository.findOne(accountDetails.userId);    
        } catch (error) {
            return response.status(500).json({ message: "user does not exist" });
        }
        
        const newAccount = this.accountRepository.create( {
            accountType: accountDetails.accountType,
            balanceAmount: accountDetails.balanceAmount,
            user: user
        })
        try {
            await this.accountRepository.save(newAccount);    
        } catch (error) {
            return response.status(500).json({ message: "account creation failed" });
        }
    
        return response.status(200).json({ message: "user account created" });
    }

    public async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.accountRepository.findOne(request.params.id);
        await this.accountRepository.remove(userToRemove);
    }

}