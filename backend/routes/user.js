const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userCtrl');
const messageCtrl = require('../controllers/messageCtrl')
const likesCtrl = require('../controllers/likesCtrl')


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', userCtrl.profile);
router.put('/profile/:id', userCtrl.updateProfile);

router.post('/messages/create', messageCtrl.createPost);
router.get('/messages/', messageCtrl.listPost);

router.post('/messages/:messageId/vote/like', likesCtrl.like);
router.post('/messages/:messageId/vote/dislike', likesCtrl.dislike);

 
module.exports = router;