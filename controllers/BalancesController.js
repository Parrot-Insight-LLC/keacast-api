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
     connection.query('CREATE TABLE IF NOT EXISTS balances (balanceid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, accountid INT NOT NULL, date DATETIME NOT NULL, daterange INT NOT NULL, amount DECIMAL(20,2) NOT NULL)', (err, result) => {
          console.log('balances table created');
          connection.release();
          if (err) throw err;
     });
});

// Start Balances
exports.startBalances = async (req, res) => {
     let balanceInfo = req.body;
     let accountid = req.params.accid;
     
     const date = moment(balanceInfo.date).format('YYYY-MM-DD');
     let start = moment(date).subtract(balanceInfo.daterange, 'days');
     let ahead = Number(balanceInfo.daterange);
     let end = moment(balanceInfo.date).add(ahead, 'days');
     let values = [];

     for (let startDate = moment(start); startDate.isBefore(balanceInfo.date); startDate.add(1, 'days')) {
          let date = startDate.format('YYYY-MM-DD');
          let amount = 0;

          let data = [
               accountid,
               date,
               balanceInfo.daterange,
               amount
          ];
          values.push(data);
     }

     let data = [
          accountid,
          moment(balanceInfo.date).format('YYYY-MM-DD'),
          balanceInfo.daterange,
          balanceInfo.amount
     ];
     values.push(data);

     var sql = `INSERT INTO balances (accountid, date, daterange, amount) VALUES ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, [values], (err, result) => {
               console.log('1 record inserted');
               res.status(201).json({
                    message: 'Balances has been successfully added.',
                    data: values
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Add Balance
exports.addBalance = async (req, res) => {
     let balanceInfo = req.body;
     let accountid = req.params.accid;
     let date = moment(balanceInfo.date, 'YYYY/MM/DD').format('YYYY-MM-DD');
     console.log(date);

     let data = [
          accountid,
          date,
          balanceInfo.daterange,
          balanceInfo.amount
     ];

     var sql = `INSERT INTO balances(accountid, date, daterange, amount) VALUES (?,?,?,?)`;
     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               console.log('1 record inserted');
               res.status(201).json({
                    message: 'Balance has been successfully added.',
                    data: data
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Get Balances
exports.getBalances = async (req, res) => {
     let accountid = req.params.accid;

     var sql = `SELECT * FROM balances WHERE accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, accountid, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// Update balances
exports.updateBalances = (req, res) => {
     let balanceInfo = req.body;
     let accountid = parseInt(req.params.accid);

     const data = [
          balanceInfo.date,
          balanceInfo.daterange,
          balanceInfo.amount,
          accountid,
          balanceInfo.balanceid
     ];

     let sql = `UPDATE balances SET date = ?, daterange = ?, amount = ? WHERE accountid = ? AND balanceid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated balance',
                         data: accountid
                    })
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete balance
exports.deleteBalance = (req, res) => {
     let balanceid = parseInt(req.params.id);

     let sql = `DELETE FROM balances WHERE balanceid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, balanceid, (err, result) => {
               res.status(201).json({
                    message: 'Successfully delete a balance',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete All Balances
exports.deleteAllBalances = (req, res) => {
     let accountid = req.params.accid;

     let sql = `DELETE FROM balances WHERE accountid = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, accountid, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted all balances',
                    data: result
               });
               connection.release();
               if (err) throw err;
          });
     });
}
