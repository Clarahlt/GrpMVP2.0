//imports
const bcrypt = require('bcrypt');
//importe le middleware d'authentification
const auth = require('../middlewares/auth');
//Importe le modèle utilisateur
const models = require('../models');

// Importe l'outil de cryptage/decryptage mail
const { encrypt, decrypt } = require ('../utils/Email');

// Importation de l'outil Password 
const { isPasswordValid, validationMessages } = require('../utils/Password');


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

   // Vérification de la validité du mot de passe
    if (!isPasswordValid(req.body.password)) {
        return res.status(400).json({
            error: validationMessages(req.body.password)
        });
    }
     // Vérification de la syntaxe de l'email grâce à Regex
     else if (!/^[\w-\.]{3,20}@([\w-]{3,}\.)+[\w-]{2,4}$/.exec(req.body.email)) {
        return res.status(400).json({error: "Email n'est pas valide. Veuillez utiliser une syntaxe correcte"}); 
        }

    //Permet de vérifier que l'utilisateur existe dans la base de données
    models.User.findOne({
        attributes: ['email'],
        where: { email : encrypt(email)}
    })
    .then(function(userFound){
        //Si l'utilisateur n'est pas trouvé dans la BD
        if(!userFound) {
            //L'email récupèré dans le corps de la requête est cryptée avant d'être stocké
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
            return res.status(409).json({"error": "l'utilisateur existe déjà"})
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
        if(userFound){
            //bcrypt compare le mdp entré en clair avec le mot de passe salé de la BD
            bcrypt.compare(password, userFound.password, function(err, results){
                //Si le mdp est valide, l'utilisateur accède à ses données et obtient un token
                // Son email doit être décrypter pour être affiché sur le frontend
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
                        "error" : "mot de passe incorrect"
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

    // Récupére les données de l'utilisateur grâce à son identifiant pour les afficher sur son profil
    // L'email doit être décryptée pour être affichée.
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

    // Permet d'enregistrer les photos de profil sur le serveur
    const user = req.file ?
    {
     ...req.body,
    imageProfile: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body.imageProfile };

    // Permet de crypter l'email si celui-ci est modifié sur le frontend avant de le stocker à nouveau dans la BD.
    const encryptUser = encrypt(req.body.email)

    // On cherche l'utilisateur correspondant dans la base données,
    // S'il existe, ses données peuvent être modifiées.
    models.User.findOne({
            attributes: ['id', 'username', 'lastname', 'firstname', 'bio', 'email', 'imageProfile'],
            where : { id: userId}
        })
        .then((userFound) => {
            if(userFound){
                userFound.update({
                    username: (username ? username : userFound.username),
                    lastname: (lastname ? lastname : userFound.lastname),
                    firstname: (firstname ? firstname : userFound.firstname),
                    bio : (bio ? bio : userFound.bio),
                    email: ( encryptUser  ? encryptUser : userFound.email),
                    imageProfile: (user.imageProfile ? user.imageProfile : userFound.imageProfile)
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


    // Permet de récupérer toutes les interractions de l'utilisateur afin de les supprimer
    // Si les interractions sont trouvées, elles sont supprimées avant que le profil ne soit supprimé
    // Si aucune interraction n'existe, le profil est directement supprimé
    models.Like.findAll({
        where: { userId : userId}
    })
    .then((likesFound)=>{
        if(likesFound){
            models.Like.destroy({
                where: { userId : userId}
            })
            .then((likesDeleted) => {
                models.User.destroy({
                    where: { id : userId}
                })
                .then((userDeleted) => {
                    return res.status(200).json({"message" : "Votre compte a bien été supprimé !"})
                })
                .catch((error) => {
                    return res.status(400).json({"error" : "Un problème est survenu lors de la suppréssion du compte"})
                })
            })
            .catch((error) => {
                return res.status(400).json({"error" : "Impossible de supprimer les likes de l'utilisateur"})
            })
        } else {
            models.User.destroy({
                where: { id : userId}
            })
            .then((userDeleted) => {
                return res.status(200).json({"message" : "Votre compte a bien été supprimé !"})
            })
            .catch((error) => {
                return res.status(400).json({"error" : "Un problème est survenu lors de la suppréssion du compte"})
            })
        }
    })
    .catch((error)=>{
        return res.status(500).json({"error" : "un problème est survenu lors de la recherche concernant les interractions de l'utilisateur."})
    })
}
