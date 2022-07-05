//Imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('cookie-session')

//Permet d'importer les routes
const userRoutes = require('./routes/user');

const app = express();

//Middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


const expiryDate = new Date(Date.now() + 300000);
  app.use(session({
    name: 'session',
    secret: process.env.SESSSION_KEY,
    resave : false,
    saveUninitialized: true,
    cookie: { 
      secure: true,
      httpOnly: true,
      domain: 'http://http://localhost:8080',
      expires: expiryDate,
    }
  }));

//Transforme le corps de la requête en objet JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Permet d'accéder aux Users Routes
app.use('/api/auth/', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/users/', userRoutes);

//Permet d'accéder aux Posts Routes
app.use('/messages/create', userRoutes);
app.use('/messages/', userRoutes);


module.exports = app;