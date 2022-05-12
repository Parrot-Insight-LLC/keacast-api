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
     connection.query('CREATE TABLE IF NOT EXISTS subscriptions (subscription_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, user_id INT NOT NULL, subscription_name VARCHAR(100), subscription_parameters VARCHAR(128), subscription_start DATETIME NOT NULL, subscription_end DATETIME NOT NULL, cancel_at_period_end BIT, created_at DATETIME NOT NULL, updated_at DATETIME, metadata TEXT)', (err, result) => {
          console.log('subscriptions table created');
          connection.release();
          if (err) throw err;
     });
});

// Get Subscriptions
exports.getSubscriptions = async (req, res) => {
     let subscription_id = req.params.subscriptionId;

     var sql = `SELECT * FROM subscriptions`;

     connection.getConnection((err, connection) => {
          connection.query(sql, subscription_id, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}


