const express = require('express');
const router = express.Router();
const hintController = require('../controllers/hintController');

router.post('/', hintController.getHint);

module.exports = router;
