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
     connection.query('CREATE TABLE IF NOT EXISTS themes (themeid INT AUTO_INCREMENT PRIMARY KEY NOT NULL, userid INT NOT NULL, accent VARCHAR(100) NOT NULL, darkMode BOOLEAN NOT NULL)', (err, result) => {
          console.log('Themes table created');
          connection.release();
          if (err) throw err;
     });
});

// GET users
exports.getTheme = (req, res) => {
     let userid = req.params.id;
     
     var sql = `SELECT * FROM themes WHERE userid = ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, userid, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

exports.setTheme = (req, res) => {
     let themeInfo = req.body;
     let userid = req.params.id;
     

     let data = [
          userid,
          themeInfo.accent,
          themeInfo.darkMode
     ]

     connection.getConnection((err, connection) => {
          connection.query('INSERT INTO themes (userid, accent, darkMode) VALUES (?,?,?)', data, (err, result) => {
               res.status(201).json({
                    message: 'Set theme'
               });
               connection.release();
               if (err) throw err;
          })
     });
}

exports.updateTheme = (req, res) => {
     let themeInfo = req.body;
     let userid = req.params.id;

     let data = [
          themeInfo.accent,
          themeInfo.darkMode,
          userid
     ]

     let sql = `UPDATE themes SET accent = ?, darkMode = ? WHERE userid = ?`;
     
     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               res.status(201).json({
                    message: 'Update theme'
               });
               connection.release();
               if (err) throw err;
          })
     });
}