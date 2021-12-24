require("dotenv").config();
const express = require("express");
const models = require("../models");

const getAllServices = async (req, res) => {
  try {
    const Service = await models.Services.findAll({});
    res.status(200).send({
      status: true,
      message: "Successfully get all services data",
      data: Service,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
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
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
};
