//Importe le modele message
const models = require('../models');

//Permet d'accéder au middleware d'authentification
const auth = require('../middlewares/auth')

const contentRegex = /([aA-zZ]{3,250})/g;

//Permet de poster un message
exports.createPost = (req, res, next) => {
    //Permet de vérifier le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    title = req.body.title
    content = req.body.content

    //Vérifie si tous les champs sont complétés
    if(title == "" || content == "") {
        return res.status(400).json({"error": "Tous les champs doivent être remplis"})
    }
    else if(!contentRegex.test(content)){
        return res.status(400).json({"error": "Votre message doit contenir entre 3 et 250 caractères."})
    }

    // Permet de trouver l'utilisateur créateur du post dans la BD, 
    // et d'adresser son identifiant au nouveau message posté 
    models.User.findOne({
        attributes: ['id', 'username'],
        where : { id: userId }
    })
    .then(function(userFound){
        if(userFound){
            models.Message.create({
                title: title,
                content: content,
                attachment: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.image,
                likes: 0,
                userId: userId
            })
            .then(function(newPost){
                return res.status(201).json({"message" : "Votre message est en ligne :) !"})
            }) 
            .catch((error) => {
                return res.status(400).json({"error" : error})
            })
        } else {
            return res.status(404).json({"error" : "utilisateur non trouvé"})
        }
    }).catch(function(erreur){
        return res.status(500).json({ "error" : "impossible de vérifier l'utilisateur"})
    });
},

//Permet de récupérer et d'afficher la liste des messages
exports.listPost = (req, res, next) => {
    fields = req.query.fields // permet de récupérer les colonnes qu'on souhaite afficher
    limit = parseInt(req.query.limit) 
    offset = parseInt(req.query.offset) // limit et offset permettent de récupérer les messages par segmentation afin d'avoir les messages un à un avec un systeme de page
    order = req.query.order // permet de sortir la liste des messages via un order particulier

    // Permet de trouver tous les messages présents dans la BD
    // cette méthode prend en tant que premier params tous les attributs de notre requête en s'assurant que l'utilisateur entre des données corrects
    // ne peuvent pas être NULL, et autres restrictions...
    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            as : "User",
            attributes: ['username', 'imageProfile'],
            
        }]
    })
    .then(function(messages){
        if(messages) {
           res.status(200).json(messages)
         } else {
             res.status(404).json({"error" : "no messages found"});
         } 
     })
    .catch(function(err){
        console.log(err)
        res.status(500).json({"error": "invalid fields"})
    })
},

//Permet de modifier un post
exports.modifyPost = (req,res) => {
    //Permet de vérifier le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});
 
     const messageId = req.params.messageId
     const title = req.body.title
     const content = req.body.content
     const newAttachment = req.file ?
     {
      ...req.body,
      attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };


    models.User.findOne({
        attributes: ['id', 'isAdmin'],
        where: { id : userId}
    })
    .then((userFound) => {
        models.Message.findOne({
            attributes: ['id', 'title', 'content', 'attachment'],
            where: {
                id: messageId,
            }
        })
        .then((messageFound) => {
            if((userId === messageFound.userId || userFound.isAdmin === true) && messageFound){
                messageFound.update(newAttachment, {
                    title: (title ? title : messageFound.title),
                    content: (content ? content : messageFound.content),
                    attachment: (newAttachment ? newAttachment : messageFound.attachment)
                })
                return res.status(200).json(messageFound)
            } else {
                return res.status(500).json({"error" : "La modification n'a pas été prise en compte"})
            }   
        })
        .catch(function(err){
            console.log(err);
            return res.status(500).json({"error" : "Impossible de vérifier"})
        })
    })
},

//Permet de supprimer un message
exports.deletePost = (req,res) => {
    //Permet de vérifier le token
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    messageId = req.params.messageId
    console.log(messageId);


    // Permet de récupérer l'utilisateur faisant la demande de suppression
    // Afin de vérifier s'il est bien le créateur du message à supprimer, ou s'il est administrateur
    models.User.findOne({
        attributes: ['id', 'isAdmin'],
        where: { id : userId}
    })
    .then((userFound) => {
        models.Message.findOne({
            where: {
                id: messageId,
            }
        })
        .then(function(messageFound){
            // Si l'utilisateur est bien le créateur du message OU si l'utilisateur est admin ET si un message est trouvé en fonction de son ID
            // On récupère tous les likes correspondant au message trouvé afin de les supprimer
            // S'ils sont bien supprimés ou s'il n'en existait aucun, la suppression du message est également validée.
            // Une fois toutes ces données supprimées, l'utilisateur est également upprimé avec succès de la BD.
            if((userId === messageFound.userId || userFound.isAdmin === true) && messageFound){
                    models.Like.findAll({
                    where:{
                       messageId : messageId,
                    }
                })
                .then(function(likeFound){
                    if(likeFound){
                        console.log(likeFound);
                        models.Like.destroy({
                            where:{
                                messageId : messageId,  
                        }
                        }).then((LikeDeleted)=>{
                            if(LikeDeleted){
                                models.Message.destroy({
                                    where: {
                                        id : messageId,
                                    }
                                }).then((messageDeleted) => {
                                    return res.status(200).json({"message" : "Message deleted with success", messageDeleted})
                                }).catch((err) => {
                                    return res.status(400).json({"error" : "Message not deleted"})
                                })
                            } else {
                                if(messageFound){
                                    models.Message.destroy({
                                        where: {
                                            id : messageId,
                                        }
                                    }).then((messageDeleted) => {
                                        return res.status(200).json({"message" : "Message deleted with success", messageDeleted})
                                    }).catch((err) => {
                                        return res.status(400).json({"error" : "Message not deleted"})
                                    })
                                } else { 
                                    res.status(404).json({"error" : "message not found"})
                                }
                            }
                        }).catch((err)=>{
                            return res.status(500).json({"error" : "impossible to deleted the likes found"})
                        })               
                    } else {
                        res.status(404).json({"error" : "Likes not found"})
                    }
                }).catch(() => {
                    res.status(500).json({"error" : "cannot find like"})
                })
             
            } 
        })
        .catch(()=> {
            return res.status(500).json({"error" : "Cannot find this message"})
        })
    })
}
