import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import { User } from "./user";

export enum AccountType {
    SAVINGS = "savings",
    CURRENT = "current",
    BASIC_SAVINGS = "basic_savings"
}

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    accountNumber: number;

    @Column({
        type: "enum",
        enum: AccountType,
        default: AccountType.SAVINGS
    })
    accountType: AccountType;

    @ManyToOne(type => User, user => user.accounts, {
        nullable: false,
    })
    user: User

    @Column({
        type: "int",
        default: 0,
        unsigned: true
    })
    balanceAmount: number;

    @CreateDateColumn({type: "timestamp"})
    createdOn: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedOn: Date;

}
