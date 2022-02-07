require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");

const getAllServices = async (req, res) => {
  try {
    const { count, rows } = await models.Services.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Services data is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get all services data",
        data: rows,
      });
    }
    log.logger.info("GET ./place/services is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./place/services -> ${error.message}`);
  }
};

const createService = async (req, res) => {
  try {
    const { id_place, service, price } = req.body;
    const Service = await models.Services.create({
      id_place: id_place,
      service: service,
      price: price,
    });
    res.status(200).send({
      status: true,
      message: "Service data created successfully",
      data: Service,
    });
    log.logger.info("POST ./place/services is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./place/services -> ${error.message}`);
  }
};

module.exports = {
  createService,
  getAllServices,
};
