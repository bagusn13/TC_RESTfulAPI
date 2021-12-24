"use strict";
const { Model } = require("sequelize");
const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Transaction, Capster }) {
      // define association here
      this.hasMany(Transaction, {
        foreignKey: "id_appoint",
        as: "transactions",
      });
      this.hasOne(Capster, {
        sourceKey: "id_capster",
        foreignKey: "id",
        as: "capster",
      });
    }
  }
  Appointment.init(
    {
      book: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("book")).format(
            "DD/MM/YYYY HH:mm:ss"
          );
        },
      },
      start: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("start")).format(
            "DD/MM/YYYY HH:mm:ss"
          );
        },
      },
      end: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue("end")).format("DD/MM/YYYY HH:mm:ss");
        },
      },
      hash: DataTypes.STRING,
      notes: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      status: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      placeId: DataTypes.INTEGER,
      id_capster: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );
  return Appointment;
};
