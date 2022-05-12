const express = require('express');
const router = express.Router();

const { createToken, publicToken, storeToken, getAccounts, storeBankID, storeAccount, getTransactions, getBalances, refreshTransactions, getCategories } = require('../controllers/PlaidController');

router.post('/api/create_link_token', createToken);

router.post('/api/exchange_public_token', publicToken);

router.post('/account/storetoken/:id/:accid', storeToken);

router.get('/api/accounts/:id/:accid', getAccounts);

router.post('/account/storeaccount/:id/:accid', storeAccount);

router.get('/api/transactions/:access_token', getTransactions);

router.get('/api/balances/:token', getBalances);

router.get('/api/refresh/:access_token', refreshTransactions);

router.get('/api/categories', getCategories);

module.exports = router;