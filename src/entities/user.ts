import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany, JoinColumn} from "typeorm";
import { Account } from "./account";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @CreateDateColumn({type: "timestamp", name: "created_on"})
    createdOn: Date;

    @UpdateDateColumn({type: "timestamp", name: "updated_on"})
    updatedOn: Date;

    @OneToMany(type => Account, account => account.user, {
        eager: true
    })
    accounts: Account[]
}
