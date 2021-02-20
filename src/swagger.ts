export const swaggerJson = {
    "swagger": "2.0",
    "info": {
        "title": "give india test",
        "version": "0.0.1"
    },
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "tags": [
        {
            "name": "User",
            "description": "Everything about users"
        },
        {
            "name": "Account",
            "description": "Everything about Accounts"
        },
        {
            "name": "Transaction",
            "description": "Performing transactions"
        }
    ],
    "paths": {
        "/users": {
            "get": {
                "tags": [
                    "User"
                ],
                "operationId": "getAllUsers",
                "summary": "List all users",
                "description": "Lists all users and their accounts.\n",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "200 response",
                        "examples": {
                            "application/json": ""
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "User"
                ],
                "operationId": "createUser",
                "summary": "Add a new user",
                "description": "Creates a new user\n",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "newUser",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "required": [
                                "firstName",
                                "lastName",
                                "age"
                            ],
                            "properties": {
                                "firstName": {
                                    "type": "string"
                                },
                                "lastName": {
                                    "type": "string"
                                },
                                "age": {
                                    "type": "integer"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "200 response",
                        "examples": {
                            "application/json": ""
                        }
                    }
                }
            }
        },
        "/accounts": {
            "get": {
                "tags": [
                    "Account"
                ],
                "operationId": "getAccounts",
                "summary": "List all accounts",
                "description": "List all the account details.\n",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "202 response",
                        "examples": {
                            "application/json": ""
                        }
                    }
                }
            },
            "post": {
                "tags": [
                    "Account"
                ],
                "operationId": "createAccount",
                "summary": "Add a new account for a user",
                "description": "Creates a new account for a user\n",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "newAccount",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "required": [
                                "userId",
                                "balanceAmount",
                                "accountType"
                            ],
                            "properties": {
                                "userId": {
                                    "type": "integer"
                                },
                                "balanceAmount": {
                                    "type": "integer"
                                },
                                "accountType": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "200 response",
                        "examples": {
                            "application/json": ""
                        }
                    }
                }
            }
        },
        "/transaction": {
            "post": {
                "tags": [
                    "Transaction"
                ],
                "operationId": "performTransaction",
                "summary": "Performs transaction",
                "description": "Deducts money from one account and deposits it in another account.\n",
                "produces": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "name": "transaction",
                        "in": "body",
                        "schema": {
                            "type": "object",
                            "required": [
                                "toAccountId",
                                "fromAccountId",
                                "amount"
                            ],
                            "properties": {
                                "toAccountId": {
                                    "type": "integer"
                                },
                                "fromAccountId": {
                                    "type": "integer"
                                },
                                "amount": {
                                    "type": "integer"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "200 response",
                        "examples": {
                            "application/json": ""
                        }
                    },
                    "500": {
                        "description": "500 response",
                        "examples": {
                            "application/json": ""
                        }
                    }
                }
            }
        }
    }
}