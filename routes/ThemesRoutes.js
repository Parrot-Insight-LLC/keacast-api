const express = require('express');
const router = express.Router();

const { getTheme, setTheme, updateTheme } = require('../controllers/ThemesController');

router.get('/get/theme/:id', getTheme);

router.post('/set/theme/:id', setTheme);

router.post('/update/theme/:id', updateTheme);

module.exports = router;