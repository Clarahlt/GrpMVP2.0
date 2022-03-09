const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
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

            bcrypt.genSalt(5, function(err, salt){
                bcrypt.hash(req.body.password, salt, function(error, bcryptedPassword){
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
                            'userId': newUser.id,
                            'password': bcryptedPassword,
                            'token': "RANDOM_TOKEN_SECRET"
                        })
                    })
                    .catch(function(error){
                        return res.status(500).json({"error": "L'utilisateur ne peut être ajouté!"})
                    })
                })
            })
        } else {
            return res.status(409).json({"message": "l'utilisateur existe déjà"})
        }
    })
    .catch(function(erreur){
        return res.status(500).json({ "error" : "impossible de vérifier l'utilisateur"})
    })
},


exports.login = (req, res) => {
    email = req.body.email
    password = req.body.password

    if(email == "" || password == ""){
        return res.status(400).json({"error": "Tous les champs doivent être remplis"})
    }
    models.User.findOne({
        where: { email : email }
    })
    .then(function(userFound){

        if(userFound){
            bcrypt.compare(password, userFound.password, function(err, results){
                if(results){
                return res.status(200).json({
                    results : results,
                    userId: userFound.id,
                    token : auth.generateRandomToken(userFound)

                }) } else {
                    return res.status(404).json({
                        "mess" : "mot de passe incorrect"
                    })
                }
               })
         }
         else {
             return res.status(404).json({
                 "error" : "L'utilisateur n'existe pas"
             })
         }
    })
    .catch(err => res.status(500).json({"error": "impossible de vérifier l'utilisateur"}))
}