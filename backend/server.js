import express from 'express'

const server = express();


server.listen(8080, function(){
    console.log('Server en écoute')
})