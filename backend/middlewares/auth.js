//Importe jsonwebtoken
const jwt = require('jsonwebtoken');

//Permet de générer un token (gererateRandomToken), 
//de parser l'en-tête "authorization" (parseAuthorization)
//et de  vérifier le token envoyé par le frontend (verifyToken)
module.exports = {
      generateRandomToken: function(userData){
        return jwt.sign(
          { userId: userData.id,
            isAdmin: userData.isAdmin,},
          'RANDOM_TOKEN_SECRET', 
          { expiresIn : '12h'})
      },
      parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer', '') : null;
      },
      verifyToken: function(authorization, req, res) {
        const userId = -1
        const token = module.exports.parseAuthorization(authorization)
        if(token != null){
          try{
          jwtToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
          if(jwtToken != null){
            return jwtToken.userId
          }
          } catch {}
        }
        return userId
      }
};