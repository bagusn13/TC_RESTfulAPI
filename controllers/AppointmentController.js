require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");
const moment = require("moment");
const randstr = require("../helper/randStr");

// get all appoint
const getAllAppoint = async (req, res) => {
  try {
    const { count, rows } = await models.Appointment.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Appointment data is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get all appointment data",
        data: rows,
      });
    }
    log.logger.info("GET ./appoint is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./appoint -> ${error.message}`);
  }
};

// get history appoint by user
const getAppointByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { count, rows } = await models.Appointment.findAndCountAll({
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
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Appointment history is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get appointment history data",
        data: rows,
      });
    }
    log.logger.info("GET ./appoint/:userId is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./appoint/:userId -> ${error.message}`);
  }
};

// create appointment
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
    log.logger.info("POST ./appoint is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./appoint -> ${error.message}`);
  }
};

// delete appointment by id
const deleteAppoint = async (req, res) => {
  try {
    const id = req.params.id;

    // cek apakah data yang ingin dihapus ada atau tidak
    const isId = await models.Appointment.findOne({
      where: {
        id: id,
      },
    });
    if (isId) {
      await models.Appointment.destroy({
        where: {
          id: id,
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
    log.logger.info("DELETE ./appoint/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`DELETE ./appoint/:id -> ${error.message}`);
  }
};

module.exports = {
  getAllAppoint,
  createAppoint,
  getAppointByUserId,
  deleteAppoint,
};
