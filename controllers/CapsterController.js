require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");

const createCapster = async (req, res) => {
  try {
    const { id_place, name } = req.body;

    const Capster = await models.Capster.create({
      id_place: id_place,
      name: name,
    });

    res.status(200).send({
      status: true,
      message: "Capster data created successfully",
      data: Capster,
    });
    log.logger.info("POST ./capster is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./capster -> ${error.message}`);
  }
};

module.exports = { createCapster };
