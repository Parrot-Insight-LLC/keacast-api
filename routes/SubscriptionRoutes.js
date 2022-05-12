const express = require('express');
const router = express.Router();

const { getSubscriptions } = require('../controllers/SubscriptionController');

// router.post('/balances/start/:accid', startBalances);

// router.post('/balances/add/:accid', addBalance);

router.get('/subscriptions', getSubscriptions);

// router.post('/balances/update/:accid', updateBalances);

// router.delete('/balances/delete/:id', deleteBalance);

// router.delete('/balances/deleteall/:accid', deleteAllBalances);

module.exports = router;