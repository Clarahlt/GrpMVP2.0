const jwt = require('jsonwebtoken');

module.exports = {
      generateRandomToken: function(userData){
        return jwt.sign(
          { userId: userData.id,
            isAdmin: userData.isAdmin,},
          'RANDOM_TOKEN_SECRET', 
          { expiresIn : '24h'})
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