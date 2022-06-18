'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Film.hasMany(models.Order, {
        foreignKey: 'filmId'
      });
    }
  }
  Film.init({
    title: DataTypes.STRING,
    year: DataTypes.INTEGER,
    genre: DataTypes.STRING,
    director: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    synopsis: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Film',
  });
  return Film;
};