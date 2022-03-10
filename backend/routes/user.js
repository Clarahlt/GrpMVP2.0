const express = require('express');
const router = express.Router();



const userCtrl = require('../controllers/userCtrl');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', userCtrl.profile);

module.exports = router;