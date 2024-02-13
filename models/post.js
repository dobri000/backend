'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });

      Post.belongsTo(models.User);

      Post.belongsToMany(models.User, { through: 'Likes' });

    }
  }
  Post.init({
    image: DataTypes.STRING,
    caption: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};