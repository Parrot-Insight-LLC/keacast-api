const express = require('express');
const app = express();
const hash = require('string-hash');
const moment = require('moment');
const mysql = require('mysql');
const config = require('../config')
const { createConnection } = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

var connection = mysql.createPool(config.connection);
const configuration = new Configuration({
     basePath: process.env.PLAID_ENV,
     baseOptions: {
          headers: {
               'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
               'PLAID-SECRET': process.env.PLAID_SECRET
          }
     }
});

const client = new PlaidApi(configuration);

// Create link token
exports.createToken = async (req, res) => {
     const clientUserId = 'unique-id';
     const request = {
          user: {
               client_user_id: clientUserId
          },
          client_name: 'Plaid Test App',
          products: ['auth'],
          language: 'en',
          webhook: 'https://webhook.example.com',
          country_codes: ['US'],
     };
     try {
          const createTokenResponse = await client.linkTokenCreate(request);
          res.json(createTokenResponse.data);
     } catch (error) {
          console.log(error);
     }
}

// Update link token
exports.updateLinkToken = async (req, res) => {
     const access_token = req.body.accessToken;
     console.log('Update Link: ', access_token);
     const clientUserId = 'unique-id';
     const request = {
          user: {
               client_user_id: clientUserId
          },
          client_name: 'Plaid Test App',
          country_codes: ['US'],
          language: 'en',
          webhook: 'https://webhook.sample.com',
          access_token: access_token,
     };

     try {
          const createTokenResponse = await client.linkTokenCreate(request);
          res.json(createTokenResponse.data);
     } catch (error) {
          console.log(error);
     }
}

// Exchange public token
exports.publicToken = async (req, res, next) => {
     const publicToken = req.body.public_token;
     const userid = req.params.id;

     try {
          const response = await client.itemPublicTokenExchange({
               public_token: publicToken
          });

          accessToken = response.data.access_token;
          const itemID = response.data.item_id;
          res.json(response.data);
     } catch (error) {
          console.log(error);
     }
}

// Store token
exports.storeToken = (req, res) => {
     const userid = req.params.id;
     const accountid = req.params.accid;
     const token = req.body.access_token;

     var sql = `UPDATE accounts SET access_token = ? WHERE userid = ? AND accountid = ?`;
     const data = [
          token,
          userid,
          accountid
     ];

     connection.query(sql, data, (err, result) => {
          if (err) throw err;
          if (result) {
               res.status(201).json({
                    message: 'Successfully updated an account',
                    data: result
               })
          }
     });
}

// Get accounts
exports.getAccounts = async (req, res) => {
     const userid = req.params.id;
     const accountid = req.params.accid;

     try {
          var sql = `SELECT * FROM accounts WHERE userid = ? AND accountid = ?`;
          const data = [
               userid,
               accountid
          ]
          connection.query(sql, data, async (err, result) => {
               if (err) throw err;
               if (result) {
                    const accountsResponse = await client.accountsGet({
                         access_token: result[0].access_token,
                    });
                    res.json(accountsResponse.data);
               }
          });
     } catch (error) {
          res.json(error.response);
     }
}

// Store account
exports.storeAccount = (req, res) => {
     const userid = req.params.id;
     const accountid = req.params.accid;
     const bankInfo = req.body;
     
     var sql = `UPDATE accounts SET initialbalance = ?, balance = ?, bankaccount_id = ?, bankaccount_name = ? WHERE userid = ? AND accountid = ?`;
     const data = [
          Number(bankInfo.balances.current),
          Number(bankInfo.balances.available),
          bankInfo.account_id,
          bankInfo.name,
          userid,
          accountid
     ];

     connection.query(sql, data, (err, result) => {
          if (err) throw err;
          if (result) {
               res.status(201).json({
                    message: 'Successfully updated an account',
                    data: result
               });
               connection.end();
          }
     });
}

// Get transactions
exports.getTransactions = async (req, res) => {
     const token = req.params.access_token;
     const date = moment().add(2, 'days').format('YYYY-MM-DD');
     const start = moment().subtract(3, 'months').format('YYYY-MM-DD');
     try {
          const transactionResponse = await client.transactionsGet({
               access_token: token,
               start_date: start,
               end_date: date,
               options: {
                    count: 500
               }
          });
          let transactions = transactionResponse.data.transactions;
          const total_transactions = transactionResponse.data.total_transactions;

          res.json(transactionResponse.data);
     } catch (error) {
          const code = parseInt(error.message.replace( /^\D+/g, ''));
          res.status(code).json(error);
     }
}

// Refresh transactions
exports.refreshTransactions = async (req, res) => {
     const token = req.params.access_token;
     const date = moment().add(2, 'days').format('YYYY-MM-DD');
     const start = moment().subtract(3, 'months').format('YYYY-MM-DD');

     try {
          const transactionResponse = await client.transactionsRefresh({
               access_token: token
          });

          res.json(transactionResponse);
     } catch (error) {
          console.log(error);
     }
}

// Get Real time balance
exports.getBalances = async (req, res) => {
     const token = req.params.token;

     try {
          const response = await client.accountsBalanceGet({
               access_token: req.params.token,
          });
          const accounts = response.data.accounts;

          res.json(accounts);
     } catch (error) {
          const code = parseInt(error.message.replace( /^\D+/g, ''));
          res.status(code).json(error);
     }
}

// Get Categories
exports.getCategories = async (req, res) => {
     try {
          const response = await client.categoriesGet({});
          const categories = response.data.categories;
          res.json(categories);
     } catch (error) {
          // handle error
     }
}