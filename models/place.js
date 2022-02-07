"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Services, workingTime, Capster }) {
      // define association here
      this.hasMany(Services, {
        foreignKey: "id_place",
        as: "services",
      });
      this.hasMany(workingTime, {
        foreignKey: "id_place",
        as: "workingTime",
      });
      this.hasMany(Capster, {
        foreignKey: "id_place",
        as: "capsters",
      });
    }
  }
  Place.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      urlGmaps: DataTypes.STRING,
      regional: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Place",
    }
  );
  return Place;
};
