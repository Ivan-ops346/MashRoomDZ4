const express = require('express');
const router = express.Router();
const korisnikController = require('../controllers/korisnikController');


router.post('/iskusni', korisnikController.postaniIskusni);
router.post('/determinator', korisnikController.postaniDeterminator);

module.exports = router;