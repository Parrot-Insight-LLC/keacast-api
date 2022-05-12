const express = require('express');
const app = express(); 
const hash = require('string-hash');
const moment = require('moment');
const mysql = require('mysql');
const config = require('../config')
const { createConnection } = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
dotenv.config();

var connection = mysql.createPool(config.connection);
connection.getConnection((err, connection) => {
     connection.query('CREATE TABLE IF NOT EXISTS accounts (accountid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, userid INT NOT NULL, accountname VARCHAR(100) NOT NULL, initialbalance DECIMAL(20,2) NOT NULL, balance DECIMAL(20,2) NOT NULL, available DECIMAL(20,2) NOT NULL, access_token VARCHAR(250), bankaccount_id VARCHAR(180), bankaccount_name VARCHAR(100), created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)', (err, result) => {
          console.log('accounts table created');
          connection.release();
          if (err) throw err;
     });
});

// Create Account 
exports.createAccount = async (req, res) => {
     let accountInfo = req.body;
     let userid = req.params.id;

     const date = moment(accountInfo.date).format('YYYY-MM-DD');
     const created_at = moment(date).subtract(1, 'days').format('YYYY-MM-DD');
     const updated_at = date;

     const data = [
          userid,
          accountInfo.accountname,
          accountInfo.initialbalance,
          accountInfo.initialbalance,
          accountInfo.initialbalance,
          created_at,
          updated_at
     ];

     sql = `INSERT INTO accounts(userid, accountname, initialbalance, balance, available, created_at, updated_at) VALUES (?,?,?,?,?,?,?)`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               console.log('1 record inserted');
               res.status(201).json({
                    message: 'Account has been successfully created.',
                    data: data
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Get Accounts
exports.getAccounts = async (req, res) => {
     let userid = req.params.id;

     var sql = `SELECT * FROM accounts WHERE userid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, userid, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// Get Account
exports.getAccount = async (req, res) => {
     let userid = req.params.id;
     let accountid = req.params.accid;

     var sql = `SELECT * FROM accounts WHERE userid = ? AND accountid = ?`;
     const data = [
          userid,
          accountid
     ]

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// Update Account
exports.updateAccount = async (req, res) => {
     let userid = req.params.id;
     let accountid = req.params.accid;
     let accountInfo = req.body;
     const date = moment().format('YYYY-MM-DD HH:mm:ss');

     const data = [
          accountInfo.accountname,
          date,
          userid,
          accountid
     ];

     let sql = `UPDATE accounts SET accountname = ?, updated_at = ? WHERE userid = ? AND accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated a account',
                         data: result
                    })
               }
               connection.release();
               if (err) throw err;
          });
     });
}

exports.updateAccountBalance = async (req, res) => {
     let userid = req.params.id;
     let accountid = req.params.accid;
     let accountInfo = req.body;

     const data = [
          accountInfo.balance,
          userid,
          accountid
     ];

     let sql = `UPDATE accounts SET balance = ? WHERE userid = ? AND accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated an account balance',
                         data: result
                    })
               }
               connection.release();
               if (err) throw err;
          });
     });
}

exports.updateAvailBalance = async (req, res) => {
     let userid = req.params.id;
     let accountid = req.params.accid;
     let accountInfo = req.body;

     const data = [
          accountInfo.available,
          userid,
          accountid
     ];

     let sql = `UPDATE accounts SET available = ? WHERE userid = ? AND accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated an available balance',
                         data: result
                    });
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete Account
exports.deleteAccount = (req, res) => {
     let userid = req.params.id;
     let accountid = req.params.accid;

     const data = [
          userid,
          accountid
     ]

     let sql = `DELETE FROM accounts WHERE userid = ? AND accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted an account',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}