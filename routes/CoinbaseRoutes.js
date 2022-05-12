const express = require('express');
const router = express.Router();
var cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const { redirectURI, requestToken, exchangeToken, showCoinbaseUser, showCoinbaseUserById, showCoinbaseUserAuth, showCoinbaseAccounts, showCoinbaseAccountById, showCoinbaseAccountTransactions, showCoinbaseTransactionById, storeToken, storeAccount, getTransactions, getBalances} = require('../controllers/CoinbaseController');

// const { coinbaseAccess, publicToken, storeToken, getAccounts, storeAccount, getTransactions, getBalances } = require('../controllers/CoinbaseController');


router.get('/api/coinbase', cors(corsOptions), redirectURI);

router.get('/api/coinbase/oauth/callback', requestToken);

router.get('/api/coinbase/exchange_token', exchangeToken);

router.get('/api/coinbase/v2/user', showCoinbaseUser);

router.get('/api/coinbase/v2/user/user_id', showCoinbaseUserById);

router.get('/api/coinbase/v2/user/auth', showCoinbaseUserAuth);

router.get('/api/coinbase/v2/accounts', showCoinbaseAccounts);

router.get('/api/coinbase/v2/accounts/account_id', showCoinbaseAccountById);

router.get('/api/coinbase/v2/accounts/account_id/transactions', showCoinbaseAccountTransactions);

router.get('/api/coinbase/v2/accounts/account_id/transactions/transaction_id', showCoinbaseTransactionById);

// router.post('/account/storeaccount/:id/:accid', storeAccount);

// router.get('/api/transactions/:access_token', getTransactions);

// router.get('/api/accounts/balances/:token', getBalances);

module.exports = router;