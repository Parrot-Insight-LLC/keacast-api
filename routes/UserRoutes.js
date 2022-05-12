const express = require('express');
const router = express.Router();

const { getUsers, getUser, createUser, checkUser, loginUser, updateUser, deleteUser } = require('../controllers/UserController');

router.get('/users', getUsers);

router.get('/user/:id', getUser);

router.post('/user/create', createUser);

router.post('/user/check', checkUser);

router.post('/user/login', loginUser);

router.post('/user/update/:id', updateUser);

router.delete('/user/delete/:id', deleteUser);

module.exports = router;