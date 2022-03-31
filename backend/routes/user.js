const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userCtrl');
const messageCtrl = require('../controllers/messageCtrl')
const likesCtrl = require('../controllers/likesCtrl');

const multer = require('../middlewares/multer-config');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', userCtrl.profile);
router.put('/profile/:id', multer, userCtrl.updateProfile);
router.delete('/profile/:id', userCtrl.deleteAccount);

router.post('/messages/create', messageCtrl.createPost);
router.get('/messages/', messageCtrl.listPost);

// router.get('/messages/:messageId', likesCtrl.getLikes);
router.post('/messages/:messageId/like', likesCtrl.like);
router.post('/messages/:messageId/dislike', likesCtrl.dislike);
router.delete('/messages/:messageId', messageCtrl.deletePost);

 
module.exports = router;