import {NextFunction, Request, Response} from "express";
import { getConnection } from "typeorm";
import { Account, AccountType } from "../../entities/account";
import { User } from "../../entities/user";
import { sprintf } from "sprintf";
import { AccountController } from "../account/";

export interface ITransction {
    fromAccountId: number,
    toAccountId: number,
    amount: number
}

export interface IFailedTransactionResponse {
    errorCode: number,
    errorMessage: string
}

export interface ISuccessfulTransactionResponse {
    newSrcBalance: number,
    totalDestBalance: number,
    transferedAt: number
}

export enum TransactionErrors
{
    SAME_ACCOUNT = "same_account",
    UNAUTHORIZED_TRANSACTION = "unauthorized_transaction",
    INSUFFICIENT_BALANCE = "insufficient_balance",
    BASIC_SAVINGS_LIMIT_REACHED = "basic_savings_limit_reached"
}

export class TransactionController
{
    public async performTransaction(request: Request, response: Response, next: NextFunction) {
        const transactionDetails: ITransction = request.body;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const fromAccount = await queryRunner.manager.findOne(Account, transactionDetails.fromAccountId, {
                relations: ["user"]
            });
            const toAccount = await queryRunner.manager.findOne(Account, transactionDetails.toAccountId, {
                relations: ["user"]
            });
            if (fromAccount.user.id === toAccount.user.id) {
                throw new Error(TransactionErrors.SAME_ACCOUNT);
            }
            const amount = transactionDetails.amount;
            if (fromAccount.balanceAmount < amount) {
                throw new Error(TransactionErrors.INSUFFICIENT_BALANCE);
            }
            fromAccount.balanceAmount -= amount;
            toAccount.balanceAmount += amount;
            if (toAccount.accountType == AccountType.BASIC_SAVINGS && 
                toAccount.balanceAmount>AccountController.BASIC_SAVINGS_MAX_BALANCE_AMOUNT) {
                throw new Error(TransactionErrors.BASIC_SAVINGS_LIMIT_REACHED);
            }
            await queryRunner.manager.save([fromAccount, toAccount]);
            await queryRunner.commitTransaction();    
            const transactionSuccess: ISuccessfulTransactionResponse = {
                newSrcBalance: fromAccount.balanceAmount,
                totalDestBalance: toAccount.balanceAmount,
                transferedAt: Date.now()
            }
            return response.json(transactionSuccess);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            const failureResponse = this.errorResponseByError(error);
            return response.status(failureResponse.errorCode).json(failureResponse);
        } finally {
            await queryRunner.release();
        }
    }     
    
    private errorResponseByError(error: Error): IFailedTransactionResponse
    {
        switch (error.message) {
            case TransactionErrors.SAME_ACCOUNT:
                return {
                    errorMessage: "transfer between accounts belonging to the same user is not allowed.",
                    errorCode: 500
                };
            case TransactionErrors.UNAUTHORIZED_TRANSACTION:
                return {
                    errorMessage: "unauthorized transaction.",
                    errorCode: 401
                };
            case TransactionErrors.INSUFFICIENT_BALANCE:
                return {
                    errorMessage: "insufficient balance.",
                    errorCode: 500
                };
            case TransactionErrors.BASIC_SAVINGS_LIMIT_REACHED:
                return {
                    errorMessage: sprintf(AccountController.BASIC_SAVINGS_BALANCE_AMOUNT_EXCEEDED, {
                            balanceAmount: AccountController.BASIC_SAVINGS_MAX_BALANCE_AMOUNT
                        }),
                    errorCode: 500
                };
            default:
                return {
                    errorMessage: "internal server error.",
                    errorCode: 500
                };
        }
    }
}
