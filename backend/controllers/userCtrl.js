const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const models = require('../models');
// Regex de validation
 const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const passwordRegex = /^((?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.*[!@#\$%\^&\*])).{8,20}$/;

exports.signup = (req, res, next) => {
    email = req.body.email
    username = req.body.username
    lastname = req.body.lastname
    firstname = req.body.firstname
    password = req.body.email

    if(email == "" || username == "" || lastname == "" || firstname == "" || password == "") {
        return res.status(400).json({ "error" : "Tous les champs doivent être remplis !"})
    } 
     
    // Regex Validation EMAIL/USERNAME/PASSWORD
    if(!emailRegex.test(email)) {
        return res.status(400).json({"error": "l'email n'est pas valide"})
    }

    // if(!passwordRegex.test(password)){
    //     return res.status(400).json({"error": "Le mot de passe doit contenir au moins un caractère spécial, une lettre majuscule, une lettre minuscule, et un chiffre - et doit être compris entre 7-20 caractères"})
    // }


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
                            userId : newUser.id,
                            password : bcryptedPassword,
                            token : "RANDOM_TOKEN_SECRET"
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
                    email: userFound.email,
                    username: userFound.username,
                    lastname: userFound.lastname,
                    firstname: userFound.firstname,
                    bio: userFound.bio,
                    isAdmin: userFound.isAdmin,
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
},

exports.profile = (req, res) => {
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    if(userId < 0){
        return res.status(400).json({"error" : "wrong token"})
    }

    models.User.findOne({
    attributes: ['id', 'email', 'username', 'lastname', 'firstname', 'bio', 'imageProfile'],
    where: { id : userId }
     })
    .then(function(user){
        if(user){
            return res.status(200).json({user : user})
        } else {
            res.status(404).json({ "error" : "Utilisateur non autorisé"});
        }
     })
     .catch(function(error){
         return res.status(500).json({"error" : "impossible de récupérer l'utilisateur"})
     })
},

exports.updateProfile = (req, res) => {
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    const username = req.body.username
    const lastname = req.body.lastname
    const firstname = req.body.firstname
    const bio = req.body.bio
    const email = req.body.email
    const userPic = req.file ?
    {
     ...req.body,
    imageProfile: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(userPic)

    models.User.findOne({
            attributes: ['id', 'username', 'lastname', 'firstname', 'bio', 'email', 'imageProfile'],
            where : { id: userId}
        })
        .then((userFound) => {
            if(userFound){
                userFound.update(userPic, {
                    username: (username ? username : userFound.username),
                    lastname: (lastname ? lastname : userFound.lastname),
                    firstname: (firstname ? firstname : userFound.firstname),
                    bio : (bio ? bio : userFound.bio),
                    email: (email ? email : userFound.email),
                    imageProfile: (userPic ? userPic : userFound.imageProfile)
                })
            } else {
                return res.status(500).json({"error" : "La modification n'a pas été prise en compte"})
            }
            return res.status(201).json({userFound})
        })
        .catch(function(err){
            return res.status(500).json({"error" : "Impossible de vérifier"})
        })
        
    
}

exports.deleteAccount = (req,res) => {
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    models.User.findOne({
        attributes: ['id'],
        where : { id: userId}
    }).then((userFound) => {
        if(userFound){
            models.User.destroy({
                where: { id : userId }
            }).then(()=> res.status(200).json({"message" : "Votre compte a été supprimé !"}))
            .catch(()=> res.status(500).json({ "error" : "⚠ Oops, une erreur s\'est produite !"}))
        } else {
            return res.status(404).json({"error" : "Utilisateur non trouvé"})
        }
    })
    .catch(function(err){
        return res.status(500).json({"error" : "Impossible de vérifier l'utilisateur"})
    })
}