//Importe le modele like
const models = require('../models');
const auth = require('../middlewares/auth');

//Imports
const asyncLib = require('async');

const DISLIKED = 0;
const LIKED = 1;

//Permet d'obtenir et d'afficher le nombre de likes ou dislikes sur chaque article
exports.getLikes = (req, res, next) => {
    //Permet de vérifier le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    
    messageId = parseInt(req.params.messageId);

    // Recherche de likes dans la base de données pour un message précis (messageId)
    models.Like.findOne({
             where: {
                messageId: messageId,
                userId : userId,
        }
     }).then((like) => {
         models.Message.findOne({
             where: {
                 id : messageId,
             },
             include: [{
                model: models.User,
                as : "User",
                attributes: ['username', 'imageProfile'],
                
            }]
         }).then((messageFound)=>{
             return res.status(200).json({"like" : like, "messageFound" : messageFound})
         }).catch(()=>{
             return res.status(404).json({"error" : "Cannot find message"})
         })
        
    }).catch(() => {
         return res.status(404).json({"error" : "Cannot find all likes"})
     })

},

//Permet de liker un message
exports.like = (req, res, next) => {
    //Vérifie le token 
    headerAuth = req.headers['authorization'].split('Bearer ')[1]
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    messageId = parseInt(req.params.messageId);

    if(messageId < 0){
        return res.status(404).json({"error": "invalid params"})
    }
    // Dans un premier temps, on cherche le message que l'utilisateur souhaite liker
    // Si le message est bien trouvé, on vérifie que l'utilisateur n'a pas déjà liké ce message
    // si l'utilisateur n'a pas encore liké le message, la valeur initial des likes est incrémenté de 1
    asyncLib.waterfall([
        function(done){
            models.Message.findOne({
                where: { id: messageId }
            }).then(function(messageFound){
                done(null, messageFound)
            }).catch(function(err){
                return res.status(500).json({"error" : "unable to verify message"})
            })
        }, 
        function(messageFound, done){
            if(messageFound){
                models.User.findOne({
                    where: { id : userId }
                }).then(function(userFound){
                    done(null, messageFound, userFound)
                }).catch(function(err){
                    return res.status(500).json({"error" : "unable to verify user"})
                });
            } else {
                res.status(404).json({"error" : "post already Liked"})
            }
        },
        function(messageFound, userFound, done){
            if(userFound){
                models.Like.findOne({
                    where: {
                        userId: userId,
                        messageId: messageId,
                    }
                }).then(function(alreadyLiked){
                    done(null, messageFound, userFound, alreadyLiked)
                }).catch( error => res.status(500).json({"error" : "unable to verify if user liked"}));
            } else {
                res.status(400).json({"error" : "user not exist"})
            }
        },
        function(messageFound, userFound, alreadyLiked, done){
            if(!alreadyLiked){
                messageFound.addUser(userFound, {isLike : LIKED})
                .then(function(alreadyLikedFound){
                    done(null, messageFound, userFound, alreadyLikedFound)
                }).catch((error) => res.status(500).json({"error" : "Cannot update message"}))
            } else {
                if(alreadyLiked.isLike === DISLIKED){
                    alreadyLiked.update({
                        isLike : LIKED,
                    }).then(function(){
                        done(null, messageFound, userFound, alreadyLiked)
                    }).catch(function(err){
                        return res.status(500).json({"error" : "cannot update user reaction"})
                    });
                } else {
                    return res.status(409).json({"error" : "message already liked", "like": alreadyLiked})
                }
            }
        },
        function(messageFound, userFound, alreadyLiked, done){
            messageFound.update({
                likes: messageFound.likes + 1,
            }).then(function(likesCounter){
                return res.status(201).json({"message" : "like counter updated", alreadyLiked, likesCounter})
            }).catch(function(error){
                return res.status(500).json({"error" : "cannot update like counter"})
            })
        }
    ], function(messageFound, userFound){
        if(messageFound){
            return res.status(201).json({messageFound, userFound})
        } else {
            return res.status(500).json({"error" : "cannot update message"})
        }
    });
},

//Permet de disliker un message
exports.dislike = (req, res) => {
    //Vérifie le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    messageId = parseInt(req.params.messageId);

    if(messageId < 0){
        return res.status(404).json({"error": "invalid params"})
    }
    
    // Dans un premier temps, on cherche le message que l'utilisateur souhaite disliker
    // On vérifie également que l'utilisateur se trouve bien dans la base de données 
    // Et si le l'identifiant du message et celui de l'utilisateur se trouve dans la table LIKES
    // si une ligne de cette table correspond au messageId et au userId, 
    // le message peut alors être dislike. Sa valeur initiale décrémenter de 1
    asyncLib.waterfall([
        function(done){
            models.Message.findOne({
                where: { id: messageId }
            }).then(function(messageFound){
                done(null, messageFound)
            }).catch(function(err){
                return res.status(500).json({"error" : "unable to verify message"})
            })
        }, 
        function(messageFound, done){
            if(messageFound){
                models.User.findOne({
                    where: { id : userId }
                }).then(function(userFound){
                    done(null, messageFound, userFound)
                }).catch(function(err){
                    return res.status(500).json({"error" : "unable to verify user"})
                })
            } else {
                res.status(404).json({"error" : "post already Liked"})
            }
        },
        function(messageFound, userFound, done){
            if(userFound){
                models.Like.findOne({
                    where: {
                        userId: userId,
                        messageId: messageId,
                    }
                }).then(function(alreadyLiked){
                    done(null, messageFound, userFound, alreadyLiked)
                }).catch(function(err){
                    return res.status(500).json({"error" : "unable to verify if user liked"})
                })
            } else {
                res.status(400).json({"error" : "user not exist"})
            }
        },
        function(messageFound, userFound, alreadyLiked, done){
            if(!alreadyLiked){
                messageFound.addUser(userFound, isLike = LIKED)
                .then(function(alreadyLikedFound){
                    done(null, messageFound, userFound)
                }).catch(function(err){
                    return res.status(500).json({"error" : "unable to set user reaction"})
                })
            } else {
                if(alreadyLiked.isLike === LIKED) {
                    alreadyLiked.update({
                        isLike : DISLIKED
                    }).then(function(){
                        done(null, messageFound, userFound)
                    }).catch(function(err) {
                        res.status(500).json({"error" : "cannot update user reaction"})
                    })
                } else {
                    res.status(409).json({"error" : "message already disliked"})
                }
            }
        },
        function(messageFound, userFound, done){
            messageFound.update({
                likes: messageFound.likes - 1,
            }).then(function(){
                done(messageFound)
            }).catch((error) =>{
                return res.status(500).json({"error" : "cannot update message like counter"})
            })
        }
    ], function(messageFound, userFound){
        if(messageFound){
            return res.status(201).json({messageFound})
        } else {
            return res.status(500).json({"error" : "cannot get message"})
        }
    });
}