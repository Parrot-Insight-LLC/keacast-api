const express = require('express');
const router = express.Router();

const { createTransaction, getTransactions, makeCurrentTransaction, reconcileTransaction, addBankTransaction, deleteTransaction, deleteGroupTransactions, deleteAllTransactions, } = require('../controllers/TransactionsController');

router.post('/transaction/create/:accid', createTransaction);

router.get('/transaction/getall/:accid', getTransactions);

router.delete('/transaction/delete/:id', deleteTransaction);

router.delete('/transaction/deletegroup/:id', deleteGroupTransactions);

router.delete('/transaction/deleteall/:accid', deleteAllTransactions);

router.post('/transaction/reconcile/:id', reconcileTransaction);

router.post('/transaction/add/:accid', addBankTransaction);

router.post('/transaction/current/:id', makeCurrentTransaction);

module.exports = router;