import express from 'express'

const server = express();

//Indique le port utilisé par le serveur
server.listen(8080, function(){
    console.log('Server en écoute')
})