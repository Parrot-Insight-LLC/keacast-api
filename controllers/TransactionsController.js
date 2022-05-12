const express = require('express');
const app = express();
const hash = require('string-hash');
const moment = require('moment');
const mysql = require('mysql');
const config = require('../config')
const { createConnection } = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

var connection = mysql.createPool(config.connection);
connection.getConnection((err, connection) => {
     connection.query('CREATE TABLE IF NOT EXISTS transactions (transactionid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, accountid INT NOT NULL, title VARCHAR(180) NOT NULL, type VARCHAR(100) NOT NULL, category VARCHAR(250) NOT NULL, description VARCHAR(1000), start DATETIME NOT NULL, end DATETIME NOT NULL, time VARCHAR(100) NOT NULL, amount DECIMAL(20,2) NOT NULL, location VARCHAR(200), frequency VARCHAR(100) NOT NULL, groupid VARCHAR(100), forecast_type VARCHAR(100) NOT NULL, match_id VARCHAR(45))', (err, result) => {
          console.log('transactions table created');
          connection.release();
          if (err) throw err;
     });
});

// Create Account 
exports.createTransaction = async (req, res) => {
     let transactionInfo = req.body;
     let accountid = req.params.accid;
     let end = moment(transactionInfo.end);
     transactionInfo.end = moment(transactionInfo.end).add(1, 'days');
     let forecast_year = moment(transactionInfo.start).format('Y');
     let forecast_month = moment(transactionInfo.start).format('M');
     let forecast_day = moment(transactionInfo.start).format('D');
     let inputFrequency = Number(transactionInfo.frequency);
     let startDate = moment(transactionInfo.start).format('YYYY-MM-DD');
     let values = [];
     let match_id = transactionInfo.match_id ? transactionInfo.match_id : null;

     if (inputFrequency !== 2) {
          transactionInfo.groupid = Math.floor(Math.random()*(999999-100000+1)+100000);
     }

     for (let forecast_date = moment(transactionInfo.start); forecast_date.isBefore(transactionInfo.end); forecast_date.add(inputFrequency, 'days')) {
          let date;
          // Leap Year
          if (forecast_date.format('Y') % 4 == 0 && forecast_date.format('YYYY-MM-DD') !== startDate && Number(inputFrequency) >= 365) {
               inputFrequency = (Number(transactionInfo.frequency) + 1).toString();
               date = forecast_date.format('YYYY-MM-DD');
          } else if (Number(inputFrequency) >= 28 && Number(inputFrequency) <= 31) {
               let currentMonthDays = Number(moment(transactionInfo.start).daysInMonth());
               let currentMonthDay = Number(moment(transactionInfo.start).format('D'));
               let forecast_date_days = Number(forecast_date.daysInMonth());
               let next_forecast_date_days = Number(moment(forecast_date).add(1, 'month').daysInMonth());
               console.log(forecast_date_days);
               console.log(next_forecast_date_days);
               if (next_forecast_date_days < currentMonthDay && moment(forecast_date).format('MM/DD') === moment(transactionInfo.start).format('MM/DD')) {
                    inputFrequency = ((currentMonthDays - currentMonthDay) + next_forecast_date_days).toString();
               } else if ((forecast_date_days === 28 || forecast_date_days === 29) && forecast_date_days < currentMonthDay) {
                    inputFrequency = ((currentMonthDay - forecast_date_days) + forecast_date_days).toString();;
               } else if (forecast_date_days === 30 && next_forecast_date_days === 31 && currentMonthDay === 30) { 
                    switch (Number(moment(forecast_date).format('M'))) {
                         case 4:
                              inputFrequency = '30';
                              break;
                         case 6:
                              inputFrequency = '30';
                              break;
                         case 9:
                              inputFrequency = '30';
                              break;
                         case 11:
                              inputFrequency = '30';
                              break;
                         default: 
                              inputFrequency = forecast_date_days + (next_forecast_date_days - forecast_date_days).toString();
                              break;
                    }
               } else if (forecast_date_days === 30 && next_forecast_date_days === 31 && currentMonthDay === 31) { 
                    switch (Number(moment(forecast_date).format('M'))) {
                         case 4:
                              inputFrequency = '31';
                              break;
                         case 6:
                              inputFrequency = '31';
                              break;
                         case 9:
                              inputFrequency = '31';
                              break;
                         case 11:
                              inputFrequency = '31';
                              break;
                         default: 
                              inputFrequency = forecast_date_days + (next_forecast_date_days - forecast_date_days).toString();
                              break;
                    }
               } else if (forecast_date_days === 31 && next_forecast_date_days === 30 && currentMonthDay === 31) {
                    console.log(Number(moment(forecast_date).format('M')));
                    switch (Number(moment(forecast_date).format('M'))) {
                         case 5:
                              inputFrequency = '30';
                              break;
                         case 8:
                              inputFrequency = '30';
                              break;
                         case 10:
                              inputFrequency = '30';
                              break;
                         default:
                              inputFrequency = forecast_date_days - (forecast_date_days - next_forecast_date_days).toString();
                              break;
                    }
               } else {
                    inputFrequency = forecast_date.daysInMonth().toString();
               }
               console.log('Monthly', inputFrequency);
               date = forecast_date.format('YYYY-MM-DD');
          } else {
               inputFrequency = transactionInfo.frequency;
               date = forecast_date.format('YYYY-MM-DD');
          }

          if (forecast_date.isAfter(moment(transactionInfo.start).add(1, 'days'))) {
               match_id = null;
          }

          let data = [
               accountid,
               transactionInfo.title,
               transactionInfo.type,
               transactionInfo.category,
               transactionInfo.description,
               date,
               end.format('YYYY-MM-DD'),
               transactionInfo.time,
               transactionInfo.amount,
               transactionInfo.location,
               inputFrequency,
               transactionInfo.groupid,
               transactionInfo.forecast_type,
               match_id
          ];
          values.push(data);
     }

     var sql = `INSERT INTO transactions (accountid, title, type, category, description, start, end, time, amount, location, frequency, groupid, forecast_type, match_id) VALUES ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, [values], (err, result) => {
               console.log('1 record inserted');
               console.log(result);
               res.status(201).json({
                    message: 'Transaction has been successfully created.',
                    data: { id: result.insertId, groupid: values[0][11] }
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Get Transactions
exports.getTransactions = async (req, res) => {
     let accountid = req.params.accid;

     var sql = `SELECT * FROM transactions WHERE accountid = ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, accountid, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// Update Old Forecasted Transaction
exports.makeCurrentTransaction = async (req, res) => {
     let transactionid = req.params.id;
     let transactionInfo = req.body;
     

     const data = [
          moment(transactionInfo.start).format("YYYY-MM-DD HH:mm:ss"),
          moment(transactionInfo.start).format("YYYY-MM-DD HH:mm:ss"),
          '',
          'F',
          transactionid
     ];

     let sql = `UPDATE transactions SET start = ?, end = ?, groupid = ?, forecast_type = ? WHERE transactionid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated a transaction',
                         data: result
                    });
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Reconcile Transaction
exports.reconcileTransaction = async (req, res) => {
     let transactionid = req.params.id;
     let plaidInfo = req.body;
     let type;

     if (plaidInfo.amount < 0) {
          type = 'expense';
     } else {
          type = 'income';
     }

     const data = [
          plaidInfo.title,
          type,
          plaidInfo.category,
          moment(plaidInfo.date).format("YYYY-MM-DD"),
          moment(plaidInfo.date).format("YYYY-MM-DD"),
          plaidInfo.amount,
          '',
          'A',
          plaidInfo.match_id,
          transactionid
     ];

     let sql = `UPDATE transactions SET title = ?, type = ?, category = ?, start = ?, end = ?, amount = ?, groupid = ?, forecast_type = ?, match_id = ? WHERE transactionid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully reconciled a transaction',
                         data: data[8]
                    });
               }
               connection.release();
               if (err) throw err;
          });
     });
}

exports.addBankTransaction = async (req, res) => {
     let plaidInfo = req.body;
     let accountid = req.params.accid;
     let type;

     if (plaidInfo.amount < 0) {
          type = 'expense';
     } else {
          type = 'income';
     }

     let data = [
          accountid,
          plaidInfo.name,
          type,
          plaidInfo.category,
          '',
          moment(plaidInfo.date).format("YYYY-MM-DD"),
          moment(plaidInfo.date).format("YYYY-MM-DD"),
          moment(plaidInfo.date).format('HH:mm'),
          plaidInfo.amount,
          '',
          2,
          '',
          'A'
     ];

     var sql = `INSERT INTO transactions (accountid, title, type, category, description, start, end, time, amount, location, frequency, groupid, forecast_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               console.log('1 record inserted');
               res.status(201).json({
                    message: 'Transaction has been successfully created.',
                    data: data
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete Transactions
exports.deleteTransaction = (req, res) => {
     let transactionid = req.params.id;

     let sql = `DELETE FROM transactions WHERE transactionid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, transactionid, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted a transaction',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete Group Transactions
exports.deleteGroupTransactions = (req, res) => {
     let groupid = req.params.id;

     let sql = `DELETE FROM transactions WHERE groupid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, groupid, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted grouped transactions',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete All Transactions
exports.deleteAllTransactions = (req, res) => {
     let accountid = req.params.accid;

     let sql = `DELETE FROM transactions WHERE accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, accountid, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted all transactions',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}