const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');

const server = express();

const userRoutes = require('./routes/user');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use('/images', express.static(path.join(__dirname, 'images')));
server.use('/api/users', userRoutes);

server.get('/api/users/signup', (req,res) =>{
    console.log(res.body)
})

server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send('<h1>Hello</h1>')
})

server.listen(8080, function(){
    console.log('Server en écoute')
})