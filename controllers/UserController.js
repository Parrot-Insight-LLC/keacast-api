const express = require('express');
const app = express();
const hash = require('string-hash');
const moment = require('moment');
const mysql = require('mysql');
const config = require('../config')
const { createConnection } = require('mysql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
var twilioSID;
dotenv.config();

const client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

var connection = mysql.createPool(config.connection);
connection.getConnection((err, connection) => {
     connection.query('CREATE TABLE IF NOT EXISTS users (idusers INT AUTO_INCREMENT PRIMARY KEY NOT NULL, firstname VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, username VARCHAR(100) NOT NULL, phone VARCHAR(100) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)', (err, result) => {
          console.log('users table created');
          connection.release();
          if (err) throw err;
     });
});

// GET users
exports.getUsers = (req, res) => {
     var sql = `SELECT * FROM users`;

     connection.getConnection((err, connection) => {
          connection.query(sql, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// GET a user
exports.getUser = (req, res) => {
     const userid = parseInt(req.params.id);

     var sql = `SELECT * FROM users WHERE idusers = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, userid, (err, result) => {
               res.status(201).json(result);
               connection.release();
               if (err) throw err;
          });
     });
}

// Create user
exports.createUser = (req, res) => {
     const date = moment().format('YYYY/MM/DD HH:mm:ss');
     const created_at = date;
     const updated_at = date;
     let userInfo = req.body;

     const data = [
          userInfo.firstname,
          userInfo.lastname,
          userInfo.username,
          userInfo.phone,
          created_at,
          updated_at
     ]

     var sql = `SELECT * FROM users WHERE username = ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, userInfo.username, (err, result) => {
               // Unique username
               if (result[0]) {
                    res.status(404).json({
                         message: 'username is already taken.'
                    });
               } else {
                    sql = `INSERT INTO users(firstname, lastname, username, phone, created_at, updated_at) VALUES (?,?,?,?,?,?)`;
                    connection.query(sql, data, (err, result) => {
                         if (err) throw err;
                         console.log('1 record inserted');
                         res.status(201).json({
                              message: 'User has been successfully created.',
                              data: data
                         });
                    });
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Two-factor auth
exports.checkUser = (req, res) => {
     let userInfo = req.body;
     let user;

     let sql = `SELECT * FROM users WHERE username = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, userInfo.username, (err, result) => {
               if (result[0]) {
                    user = result[0];
                    client.verify.services('VAa172c79dcdb421a9e4d1830690c5a3d7').verifications.create({
                         to: '+' + user.phone,
                         channel: 'sms'
                    }).then((verification) => {

                    });
                    res.status(201).json({
                         message: 'We sent a code to your phone.',
                         data: user
                    });
               } else {
                    res.status(404).json({
                         message: 'Username cannot be found in DB.'
                    })
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Login user
exports.loginUser = (req, res) => {
     let userInfo = req.body;
     let user;

     let sql = `SELECT * FROM users WHERE username = ?`;
     connection.getConnection((err, connection) => {
          connection.query(sql, userInfo.username, (err, result) => {
               if (result[0]) {
                    user = result[0];
                    var check_status = false;
                    client.verify.services('VAa172c79dcdb421a9e4d1830690c5a3d7')
                    .verificationChecks
                    .create({to: '+' + user.phone, code: userInfo.code})
                    .then((verification_check) => {
                         check_status = verification_check.valid;
                    });
                    setTimeout(() => {
                         if (check_status) {
                              const secret = require('crypto').randomBytes(64).toString('hex');
                              const token = jwt.sign({username: user.username}, secret, { expiresIn: '24h'});
                              const userObject = {
                                   firstname: user.firstname,
                                   lastname: user.lastname,
                                   username: user.username,
                                   userid: user.idusers,
                                   jwt: token
                              }
                              res.status(201).json({
                                   message: `${userObject.username} has successfully logged in.`,
                                   data: userObject
                              });
                         } else {
                              res.status(404).json({
                                   message: 'Your code is incorrect.'
                              });
                         }
                    }, 500);
               } else {
                    res.status(404).json({
                         message: 'Username cannot be found in DB.'
                    });
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Update user
exports.updateUser = (req, res) => {
     let userInfo = req.body;
     let user_id = parseInt(req.params.id);
     const updated_at = moment().format('YYYY/MM/DD HH:mm:ss');

     const data = [
          userInfo.firstname,
          userInfo.lastname,
          userInfo.username,
          userInfo.phone,
          updated_at,
          user_id
     ];

     let sql = `UPDATE users SET firstname = ?, lastname = ?, username = ?, phone = ?, updated_at = ? WHERE idusers = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, data, (err, result) => {
               if (result) {
                    res.status(201).json({
                         message: 'Successfully updated a user',
                         data: user_id
                    })
               }
               connection.release();
               if (err) throw err;
          });
     });
}

// Delete user
exports.deleteUser = (req, res) => {
     let user_id = parseInt(req.params.id);

     let sql = `DELETE FROM users WHERE idusers = ?`;

     connection.getConnection((err, connection) => {
          connection.query(sql, user_id, (err, result) => {
               res.status(201).json({
                    message: 'Successfully deleted a user',
                    data: user_id
               });
               connection.release();
               if (err) throw err;
          });
     });
}