const express = require('express');
const router = express.Router();

const { createAccount, getAccounts, getAccount, updateAccount, updateAccountBalance, updateAvailBalance, deleteAccount } = require('../controllers/AccountController');

router.post('/account/create/:id', createAccount);

router.get('/account/getall/:id', getAccounts);

router.get('/account/get/:id/:accid', getAccount);

router.post('/account/update/:id/:accid', updateAccount);

router.post('/account/updateBalance/:id/:accid', updateAccountBalance);

router.post('/account/updateAvailBalance/:id/:accid', updateAvailBalance);

router.delete('/account/delete/:id/:accid', deleteAccount);

module.exports = router;