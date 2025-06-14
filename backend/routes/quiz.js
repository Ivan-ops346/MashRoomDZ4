const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/pitanja', quizController.getPitanja);
router.post('/submit', quizController.submitKviz);

module.exports = router;