const express = require('express');
const router = express.Router();

const { startBalances, addBalance, getBalances, updateBalances, deleteBalance, deleteAllBalances } = require('../controllers/BalancesController');

router.post('/balances/start/:accid', startBalances);

router.post('/balances/add/:accid', addBalance);

router.get('/balances/getall/:accid', getBalances);

router.post('/balances/update/:accid', updateBalances);

router.delete('/balances/delete/:id', deleteBalance);

router.delete('/balances/deleteall/:accid', deleteAllBalances);

module.exports = router;