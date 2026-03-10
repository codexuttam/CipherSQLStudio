const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.list);
router.get('/:id', assignmentController.getById);

module.exports = router;
