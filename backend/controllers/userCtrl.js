const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');


exports.signup = (req, res, next) => {
    email = req.body.email
    username = req.body.email
    lastname = req.body.lastname
    firstname = req.body.firstname
    password = req.body.email

    if(email == "" || username == "" || lastname == "" || firstname == "" || password == "") {
        return res.status(400).json({ "error" : "Tous les champs doivent être remplis !"})
    } 

    models.User.findOne({
        attributes: ['email'],
        where: { email : email}
    })
    .then(function(userFound){
        if(!userFound) {

            bcrypt.hash(password, 5, function(err, bcryptedPassword){
                const newUser = models.User.create({
                    email : email,
                    username : username,
                    lastname : lastname,
                    firstname : firstname,
                    password : bcryptedPassword,
                    isAdmin: 0
                })
                .then(function(newUser){
                    return res.status(201).json({
                        'userId': newUser.id
                    })
                })
                .catch(function(err){
                    return res.status(500).json({"error": "L'utilisateur ne peut être ajouté!"})
                })
            })
        } else {
            return res.status(409).json({"message": "l'utilisateur existe déjà"})
        }
    })
    .catch(function(err){
        return res.status(500).json({ "error" : "impossible de vérifier l'utilisateur"})
    })
}