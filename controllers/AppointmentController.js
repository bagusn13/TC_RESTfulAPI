require("dotenv").config();
const express = require("express");
const models = require("../models");
const moment = require("moment");
const randstr = require("../helper/randStr");

const getAllAppoint = async (req, res) => {
  try {
    const Appoint = await models.Appointment.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const { count, rows } = await models.Appointment.findAndCountAll();
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get all appointment data",
        data: Appoint,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getAppointByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const Appoint = await models.Appointment.findAll({
      include: [
        {
          model: models.Transaction,
          as: "transactions",
          attributes: ["id", "service", "harga"],
        },
        {
          model: models.Capster,
          as: "capster",
          attributes: ["id", "name"],
        },
      ],
      where: {
        userId: userId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const { count, rows } = await models.Appointment.findAndCountAll({
      where: {
        userId: userId,
      },
    });
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Appointment history is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get appointment history data",
        data: Appoint,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const createAppoint = async (req, res) => {
  try {
    const { book, start, notes, price, status, userId, placeId, id_capster } =
      req.body;

    const end = moment(start).add(1, "h").format("YYYY-MM-DD HH:mm:ss");
    // build unique key setiap appointment
    const date = moment().format("DDMMYYYY");
    const rndStr = await randstr.generateRandString(5);
    const uniqueKey = userId + date + rndStr;

    const Appoint = await models.Appointment.create({
      book: moment(book).format(),
      start: moment(start).format(),
      end: moment(end).format(),
      hash: uniqueKey,
      notes: notes,
      price: price,
      status: status,
      userId: userId,
      placeId: placeId,
      id_capster: id_capster,
    });

    res.status(200).send({
      status: true,
      message: "Appoint data created successfully",
      data: Appoint,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const deleteAppoint = async (req, res) => {
  try {
    const appointId = req.params.appointId;
    const userId = req.params.userId;

    // cek apakah data yang ingin dihapus ada atau tidak
    const isId = await models.Appointment.findOne({
      where: {
        id: appointId,
        userId: userId,
      },
    });
    if (isId) {
      await models.Appointment.destroy({
        where: {
          id: appointId,
          userId: userId,
        },
      });

      res.status(200).send({
        status: true,
        message: "Appointment canceled",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Appointment not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllAppoint,
  createAppoint,
  getAppointByUserId,
  deleteAppoint,
};
