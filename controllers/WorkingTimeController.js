require("dotenv").config();
const express = require("express");
const models = require("../models");

const getAllDayByIdPlace = async (req, res) => {
  try {
    const id = req.params.id;
    const workingTime = await models.workingTime.findAll({
      where: {
        id_place: id,
      },
    });
    res.status(200).send({
      status: true,
      message: `Successfully get all working time data by mitra id`,
      data: workingTime,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const createWorkingTime = async (req, res) => {
  try {
    const { id_place, day, start, end } = req.body;

    const workingTime = await models.workingTime.create({
      id_place: id_place,
      day: day,
      start: start,
      end: end,
    });

    res.status(200).send({
      status: true,
      message: "Working time data created successfully",
      data: workingTime,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllDayByIdPlace,
  createWorkingTime,
};
