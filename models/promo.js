'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Promo.init({
    title: DataTypes.STRING,
    information: DataTypes.TEXT,
    code: DataTypes.STRING,
    img: DataTypes.STRING,
    disc: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Promo',
  });
  return Promo;
};