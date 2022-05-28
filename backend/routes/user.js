//Import express
const express = require('express');

//Permet de créer un routeur
const router = express.Router();

//Permet d'importer les controllers utilisateurs, messages, et likes
const userCtrl = require('../controllers/userCtrl');
const messageCtrl = require('../controllers/messageCtrl')
const likesCtrl = require('../controllers/likesCtrl');

//Permet d'importer le middleware de gestion de fichiers multimédias
const multer = require('../middlewares/multer-config');

//Routes de l'API
///Pour les utilisateurs
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile/:id', userCtrl.profile);
router.put('/profile/:id', multer, userCtrl.updateProfile);
router.delete('/profile/:id', userCtrl.deleteAccount);

///Pour les messages
router.post('/messages/create', multer, messageCtrl.createPost);
router.get('/messages/', messageCtrl.listPost);

///Pour les likes
router.get('/messages/:messageId', likesCtrl.getLikes)
router.post('/messages/:messageId/like', likesCtrl.like);
router.post('/messages/:messageId/dislike', likesCtrl.dislike);
router.delete('/messages/:messageId', messageCtrl.deletePost);

//Exporte le routeur
module.exports = router;