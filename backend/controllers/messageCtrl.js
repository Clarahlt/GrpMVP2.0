const models = require('../models');
const auth = require('../middlewares/auth')


exports.createPost = (req, res, next) => {
    headerAuth = req.headers['authorization'].split(' ')[1];
    userId = auth.verifyToken(headerAuth)
    console.log({"verify": userId});

    title = req.body.title
    content = req.body.content
    attachment = req.body.attachment

    if(title == "" || content == "") {
        return res.status(400).json({"error": "Tous les champs doivent être remplis"})
    }

    models.User.findOne({
        attributes: ['id'],
        where : { id: userId,}
    })
    .then(function(userFound){
        if(userFound) {
                    const newPost = models.User.create({
                        title : title,
                        content : content,
                        likes: 0
                    })
                    .then(function(newPost){
                        return res.status(201).json({
                            userId : newPost.id,
                        })
                    })
                    .catch(function(error){
                        return res.status(500).json({"error": "Une erreur s'est produite"})
                    })
        } else {
            return res.status(409).json({"message": "Impossible de traiter la demande"})
        }
    })
    .catch(function(erreur){
        return res.status(500).json({ "error" : "impossible de vérifier l'utilisateur"})
    })
},

exports.listPost = (req, res, next) => {
    fields = req.query.fields
    limit = parseInt(req.query.limit)
    offset = parseInt(req.query.offset)
    order = req.query.order

    models.Message.findAll({
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        includes: [{
            model: models.User,
            attributes: ['username']
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
}