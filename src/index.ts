import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entities/user";
import { Account, AccountType } from "./entities/account";
import * as swaggerUi from "swagger-ui-express";
import { swaggerJson } from "./swagger";


const app = express();
app.use(bodyParser.json());
const server = app.listen(3000);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));


Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](req, res, next);
        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

        } else if (result !== null && result !== undefined) {
            res.json(result);
        }
    });
});



createConnection().then(async connection => {
    const userCounts = await connection.manager.count(User);
    // Initializing users and accounts for test
    if (userCounts === 0) {
        // insert new users for test
        const user1 = await connection.manager.save(connection.manager.create(User, {
            firstName: "Sundeep",
            lastName: "Paruchuru",
            age: 26
        }));
        const user2 = await connection.manager.save(connection.manager.create(User, {
            firstName: "Saitej",
            lastName: "Paruchuru",
            age: 24
        }));
        const user3 = await connection.manager.save(connection.manager.create(User, {
            firstName: "Anu",
            lastName: "Paruchuru",
            age: 23
        }));
        const user4 = await connection.manager.save(connection.manager.create(User, {
            firstName: "JayaSai",
            lastName: "Kallam",
            age: 26
        }));
        const user5 = await connection.manager.save(connection.manager.create(User, {
            firstName: "Yaswanth",
            lastName: "Valiveti",
            age: 25
        }));
        const user6 = await connection.manager.save(connection.manager.create(User, {
            firstName: "Pavan",
            lastName: "Dodda",
            age: 26
        }));
        const allUsers = [user1, user2, user3, user4, user5, user6];
        const allAccountTypes = [AccountType.BASIC_SAVINGS, AccountType.CURRENT, AccountType.SAVINGS];

        for (const user of allUsers) {
            for (let index = 0; index < 4; index++) {
                const randomAccountTypeIndex = Math.floor(Math.random() * 3);
                const randomAccountType = allAccountTypes[randomAccountTypeIndex];
                const balanceThreshold = randomAccountType === AccountType.BASIC_SAVINGS ? 50000 : 100000;
                const randomBalance = Math.floor(Math.random() * balanceThreshold);
                await connection.manager.save(connection.manager.create(Account, {
                    user: user,
                    balanceAmount: randomBalance,
                    accountType: randomAccountType
                }));
            }
        }
    }
    console.log("Express server has started on port 3000. Open http://localhost:3000/api-docs/#/ to see swagger documentation");
}).catch(error => {
    console.log(error)
    server.close();
});
