require("dotenv").config();
const express = require("express");
const models = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const config = require("../helper/schedule");

const getAvailable = async (req, res) => {
  try {
    const date = moment(req.params.date);
    const placeId = req.params.placeId;
    // generate jam pertama dan terakhir di hari itu
    const startDate = date.startOf("day").format();
    const endDate = date.endOf("day").format();
    // numOfDay = 1 - 7
    const numOfDay = date.day();

    const Appointments = await models.Appointment.findAll({
      where: {
        placeId: placeId,
        start: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const workingTimePlace = await models.workingTime.findAll({
      where: {
        id_place: placeId,
        day: numOfDay,
      },
    });

    const startTime = workingTimePlace[0].dataValues.start;
    const endTime = workingTimePlace[0].dataValues.end;

    const schedule = await config.getTimesArray(startTime, endTime, 60);

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(":");
      const value = date.hour(hour).minute(minute).second(0);

      return {
        time,
        available:
          value.isAfter(moment()) &&
          !Appointments.find((a) => moment(a.start).format("HH:mm") === time),
      };
    });

    res.status(200).send({
      status: true,
      message: `Successfully get available working time at ${date.format("L")}`,
      available: available,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { getAvailable };
