const express = require('express');
const router = express.Router();
const zadaciController = require('../controllers/zadaciController');
const verifyToken = require("../middleware/authMiddleware");

router.get('/', verifyToken, zadaciController.getZadaci);
router.post('/start', verifyToken, zadaciController.startZadatak);

module.exports = router;
