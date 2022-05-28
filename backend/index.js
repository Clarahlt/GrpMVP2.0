//Imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Permet d'importer les routes
const userRoutes = require('./routes/user');

const server = express();

//Middleware CORS
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Transforme le corps de la requête en objet JS
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

//Permet d'accéder aux Users Routes
server.use('/api/auth/', userRoutes);
server.use('/images', express.static(path.join(__dirname, 'images')));
server.use('/api/users/', userRoutes);

//Permet d'accéder aux Posts Routes
server.use('/messages/create', userRoutes);
server.use('/messages/', userRoutes);


server.listen(3000, function(){
    console.log('Server en écoute')
});