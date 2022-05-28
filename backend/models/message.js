'use strict';
//Importe Sequelize
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Message.belongsTo(models.User,{
        foreingKey:{
          allowNull: false
        }
      })
    }
  }
  Message.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      references:{
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};