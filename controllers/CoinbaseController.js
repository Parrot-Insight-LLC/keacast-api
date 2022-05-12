const express = require('express')
const app = express();
const axios = require("axios");
const dotenv = require('dotenv');

dotenv.config();

let code;
let token;

exports.redirectURI = async (req, res) => {
  res.redirect(`https://www.coinbase.com/oauth/authorize?client_id=${process.env.COINBASE_CLIENT_ID}&http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fcoinbase%2Foauth%2Fcallback&response_type=code&scope=wallet:user:read,wallet:accounts:read,wallet:transactions:read,wallet:notifications:read,wallet:user:email,wallet:deposits:read&account_currency=USDC`);
}     


exports.requestToken = async (req, res) => {

    code = req.query.code;

    axios({
        method: "post",
        url: `${process.env.COINBASE_TOKEN_REQUEST_URL}`,
        headers: {
          'Authorization': `Bearer ${code}`,
          'Access-Control-Allow-Origin': '*'
        },
        data: {
            "grant_type": "authorization_code",
            "code": `${code}`,
            "client_id": `${process.env.COINBASE_CLIENT_ID}`,
            "client_secret": `${process.env.COINBASE_SECRET}`,
            "redirect_uri": `${process.env.COINBASE_REDIRECT_URI}`,
          }
      }).then((response) => {
          console.log(response)
        const accessToken = response.data.access_token;
        token = response.data.access_token;
        console.log(accessToken)
        res.setHeader('Authorization', 'Bearer '+ accessToken);
        // res.redirect('http://localhost:3000/' + accessToken);
        //res.redirect('http://localhost:8080/api/coinbase/v2/user/?token=' + accessToken);
        res.send(accessToken)
      }).catch(function (error) {
        console.log(error);
      });
    };

    exports.exchangeToken = async (req, res) => {
    token = getAccessToken()
    console.log(token)
    res.setHeader('Authorization', 'Bearer '+ token);
  }

  let getAccessToken = (code) => { 
    
    app.post(process.env.COINBASE_TOKEN_REQUEST_URL, (req, res) => {
        res.setHeader('Authorization', 'Bearer '+ code);
    token = res.json({token})
    console.log(token)
    return token
  });

}

  exports.showCoinbaseUser = async (req, res) => {
    token = req.query.token;
    console.log(token)
    axios({
        method: "get",
        url: `https://api.coinbase.com/v2/user`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then((response) => {
          console.log(response)
        res.send(response.data)
      }).catch(function (error) {
        console.log(error);
      });
  }

  exports.showCoinbaseUserById = async (req, res,user_id) => {
    token = req.query.token;
    console.log(token)
    user_id = process.env.COINBASE_TEST_USER
 
    axios({
        method: "get",
        url: `https://api.coinbase.com/v2/users/` + user_id,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then((response) => {
          console.log(response)
        res.send(response.data)
      }).catch(function (error) {
        console.log(error);
      });
  }

  exports.showCoinbaseUserAuth = async (req, res) => {
    token = req.query.token;
    console.log(token)
 
    axios({
        method: "get",
        url: `https://api.coinbase.com/v2/user/auth`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then((response) => {
          console.log(response)
        res.send(response.data)
      }).catch(function (error) {
        console.log(error);
      });
  }


  exports.showCoinbaseAccounts = async (req, res) => {
   token = req.query.token;
   res.setHeader('Authorization', 'Bearer '+ token);
    console.log(token)
   
    axios({
        method: "get",
        url: `https://api.coinbase.com/v2/accounts` ,
        headers: {
          'Authorization': `Bearer ${token}`,
          'scope': 'wallet:accounts:read,account_currency=USDC',
        }
      }).then((response) => {
          console.log(response)
        res.send(response.data)
      }).catch(function (error) {
        console.log(error);
      });
  }

  exports.showCoinbaseAccountById = async (req, res, account_id) => {
    token = req.query.token;
    res.setHeader('Authorization', 'Bearer '+ token);
     console.log(token)
     account_id = process.env.COINBASE_TEST_ACCOUNT
     axios({
         method: "get",
         url: `https://api.coinbase.com/v2/accounts/` + account_id ,
         headers: {
           'Authorization': `Bearer ${token}`,
           'scope': 'wallet:accounts:read',
           'Access-Control-Allow-Origin': '*'
 
         }
       }).then((response) => {
           console.log(response)
         res.send(response.data)
       }).catch(function (error) {
         console.log(error);
       });
   }

   exports.showCoinbaseAccountTransactions = async (req, res, account_id) => {
    token = req.query.token;
    res.setHeader('Authorization', 'Bearer '+ token);
     console.log(token)
     account_id = process.env.COINBASE_TEST_ACCOUNT
     axios({
         method: "get",
         url: `https://api.coinbase.com/v2/accounts/` + account_id + `/transactions`,
         headers: {
           'Authorization': `Bearer ${token}`,
           'scope': 'wallet:accounts:read',
         }
       }).then((response) => {
           console.log(response)
         res.send(response.data)
       }).catch(function (error) {
         console.log(error);
       });
 
   }

   exports.showCoinbaseTransactionById = async (req, res, account_id) => {
     
    token = req.query.token;
    res.setHeader('Authorization', 'Bearer '+ token);
     console.log(token)
     account_id = process.env.COINBASE_TEST_ACCOUNT
     transaction_id = process.env.COINBASE_TEST_TRANSACTION
     console.log(transaction_id)
     axios({
         method: "get",
         url: `https://api.coinbase.com/v2/accounts/` + account_id + `/transactions/` + transaction_id,
         headers: {
           'Authorization': `Bearer ${token}`,
           'scope': 'wallet:transactions:read',
         }
       }).then((response) => {
           console.log(response)
         res.send(response.data)
       }).catch(function (error) {
         console.log(error);
       });
   }