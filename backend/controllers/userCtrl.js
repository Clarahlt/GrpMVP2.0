//imports
const bcrypt = require('bcrypt');
//importe le middleware d'authentification
const auth = require('../middlewares/auth');
//Importe le modèle utilisateur
const models = require('../models');

// Importe l'outil de cryptage/decryptage mail
const { encrypt, decrypt } = require ('../utils/Email');

// Regex de validation
 const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const passwordRegex = /^((?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.*[!@#\$%\^&\*])).{8,20}$/;

//Permet de créer un nouvel utilisateur 
exports.signup = (req, res, next) => {
    email = req.body.email
    username = req.body.username
    lastname = req.body.lastname
    firstname = req.body.firstname
    password = req.body.email

    //Permet de vérifier que tous les champs sont complétés
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

    //Permet de vérifier que l'utilisateur existe dans la base de données
    models.User.findOne({
        attributes: ['email'],
        where: { email : email}
    })
    .then(function(userFound){
        //Si l'utilisateur n'est pas trouvé dans la BD
        if(!userFound) {
            const emailEncrypted = encrypt(req.body.email)
            //un nouvel utilisateur est créé et son mot de passe est salé avant d'être stocké
            bcrypt.genSalt(5, function(err, salt){
                bcrypt.hash(req.body.password, salt, function(error, bcryptedPassword){
                    const newUser = models.User.create({
                        email : emailEncrypted,
                        username : username,
                        lastname : lastname,
                        firstname : firstname,
                        password : bcryptedPassword,
                        isAdmin: 0
                    })
                    .then(function(newUser){
                        return res.status(201).json({
                            message: "L'utilisateur a été créé!"
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

//Permet de se connecter à l'application 
exports.login = (req, res) => {
    email = req.body.email
    password = req.body.password
    console.log(encrypt(email));

    //Permet de vérifier que tous les champs sont complétés
    if(email == "" || password == ""){
        return res.status(400).json({"error": "Tous les champs doivent être remplis"})
    }

    //Permet de vérifier si l'utilisateur existe dans la BD
    models.User.findOne({
        where: { email : encrypt(email) }
    })
    .then(function(userFound){
        //Si l'utilisateur est trouvé
        console.log(userFound);
        if(userFound){
            //bcrypt compare le mdp entré en clair avec le mot de passe salé de la BD
            bcrypt.compare(password, userFound.password, function(err, results){
                //Si le mdp est valide, l'utilisateur accède à ses données et obtient un token
                if(results){
                return res.status(200).json({
                    results : results,
                    userId: userFound.id,
                    email: decrypt(userFound.email),
                    username: userFound.username,
                    lastname: userFound.lastname,
                    firstname: userFound.firstname,
                    bio: userFound.bio,
                    isAdmin: userFound.isAdmin,
                    imageProfile: userFound.imageProfile,
                    token : auth.generateRandomToken(userFound) //importe le middleware d'authentification

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

//Permet à un utilisateur d'accéder à son profil
exports.profile = (req, res) => {
    //Permet de vérifier le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    if(userId < 0 ){
        return res.status(400).json({"error" : "wrong token"})
    }

    //Permet de trouver un utilisateur dans la BD
    models.User.findOne({
    attributes: ['id', 'email', 'username', 'lastname', 'firstname', 'bio', 'imageProfile', 'isAdmin'],
    where: { id : userId }
     })
    .then(function(user){
        if(user){
            const userDetails={
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio,
            email: decrypt(user.email),
            isAdmin: user.isAdmin,
            imageProfile: user.imageProfile
        }
            return res.status(200).json({user : userDetails})
        } else {
            res.status(404).json({ "error" : "Utilisateur non autorisé"});
        }
     })
     .catch(function(error){
         return res.status(500).json({"error" : "impossible de récupérer l'utilisateur"})
     })
},

//Permet à un utilisateur de modifier son profil
exports.updateProfile = (req, res) => {
    //Permet de vérifier le token
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
                    email: ( email  ? email : userFound.email),
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

//Permet à un utilisateur de supprimer son compte ainsi que ses données personnelles
exports.deleteAccount = (req,res) => {
    //Vérifier le token
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
