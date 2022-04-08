const models = require('../models');
const auth = require('../middlewares/auth')


exports.createPost = (req, res, next) => {
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    title = req.body.title
    content = req.body.content
    attachment = req.body.attachment

    if(title == "" || content == "") {
        return res.status(400).json({"error": "Tous les champs doivent être remplis"})
    }

    models.User.findOne({
        attributes: ['id', 'username'],
        where : { id: userId }
    })
    .then(function(userFound){
        if(userFound){
            models.Message.create({
                title: req.body.title,
                content: req.body.content,
                attachment: req.body.attachment,
                likes: 0,
                userId: userFound.id
            })
            .then(function(newPost){
                return res.status(201).json({"message" : "Votre message est en ligne :) !"})
            }) .catch(error => res.status(400).json(error))
        } else {
            return res.status(404).json({"error" : "utilisateur non trouvé"})
        }
    }).catch(function(erreur){
        return res.status(500).json({ "error" : "impossible de vérifier l'utilisateur"})
    });
},

exports.listPost = (req, res, next) => {
    fields = req.query.fields
    limit = parseInt(req.query.limit)
    offset = parseInt(req.query.offset)
    order = req.query.order

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
exports.deletePost = (req,res) => {
    headerAuth = req.headers['authorization'].split('Bearer ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});
    
    messageId = req.params.messageId
    console.log(messageId);

    models.Message.findOne({
        where: {
            id: messageId,
            userId : userId
        }
    })
    .then(function(messageFound){
        if(messageFound){
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
                                    userId : userId
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
                                        userId : userId
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



}