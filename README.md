# giveIndiaProject

# Give India solution

#### Problem Statement

Write a REST-based API that enables transfer of money from one bank account to another. Please keep in mind that money transfers are inherently transactional in nature.

Account types are ‘Savings’, ‘Current’ and ‘BasicSavings’. A single user can have multiple such accounts. The following rules apply:

    - Transfer between accounts belonging to the same user is not allowed.
    - The balance in ‘BasicSavings’ account type should never exceed Rs. 50,000
    - Source account should have the required amount for the transaction to succeed

The API spec follows: (All amounts in the API are in paisa)

Input (JSON)

    fromAccountId
    toAccountId
    amount

Output (JSON)
success case:

    newSrcBalance: The balance in source account after transfer
    totalDestBalance: The total balance in all accounts of destination user combined
    transferedAt: timestamp

failure case:

    errorCode
    errorMessage

#### Solution

This project uses `typeorm` so any type of database supported by typeorm can be used. You can configure them in `ormconfig.json` file. It currently uses mariadb on localhost. The tables will be automatically created on start with 3 sample users each with 4 accounts each as per random allocation.

`Swagger 2.0` has been added for essential APIs. Please go to URL (/api-docs) to view the documentation.

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command
