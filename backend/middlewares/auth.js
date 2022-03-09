const jwt = require('jsonwebtoken');

module.exports = {
      generateRandomToken: function(userData){
        return jwt.sign(
          { userId: userData.id,
            isAdmin: userData.isAdmin,
            password: userData.password},
          'RANDOM_TOKEN_SECRET', 
          { expiresIn : '24h'})
      }
};