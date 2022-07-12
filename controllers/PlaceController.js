require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");
const path = require("path");
const fs = require("fs");

const getAllPlace = async (req, res) => {
  try {
    const { count, rows } = await models.Place.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Mitra data is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get all mitra data",
        data: rows,
      });
    }
    log.logger.info("GET ./place is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./place -> ${error.message}`);
  }
};

// create place with img (must)
const createPlace = async (req, res) => {
  try {
    const { name, address, urlGmaps, regional } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;
    const Place = await models.Place.create({
      name: name,
      address: address,
      urlGmaps: urlGmaps,
      regional: regional,
      img: pathRaw.replace(/\\/g, path.sep),
    });

    res.status(200).send({
      status: true,
      message: "Mitra data created successfully",
      data: Place,
    });
    log.logger.info("POST ./place is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./place -> ${error.message}`);
  }
};

// update place with img (must)
const updatePlace = async (req, res) => {
  try {
    // update by id
    const id = req.params.id;
    const { name, address, urlGmaps, regional } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;

    const isId = await models.Place.findOne({
      where: {
        id: id,
      },
    });

    // cek apakah id yang dimasukkan ada atau tidak
    if (isId) {
      // proses update
      const Place = await models.Place.update(
        {
          name: name,
          address: address,
          urlGmaps: urlGmaps,
          regional: regional,
          img: pathRaw.replace(/\\/g, path.sep),
        },
        {
          where: {
            id: id,
          },
        }
      );

      // cek apakah data sebelumnya punya img atau tidak
      // jika ya maka apus image lamanya
      if (!isId.dataValues.img) {
        console.log("No image data");
      } else {
        const pathDelete = "./" + isId.dataValues.img;
        fs.unlink(pathDelete, (err) => {
          if (err) {
            log.logger.fatal(err);
            return;
          }
          console.log("Image has been replaced");
        });
      }

      res.status(200).send({
        status: true,
        message: "Place data has been updated successfully",
      });
    } else {
      fs.unlink("./" + pathRaw.replace(/\\/g, path.sep), (err) => {
        if (err) {
          log.logger.fatal(err);
          return;
        }
      });
      res.status(404).send({
        status: false,
        message: "Place not found",
      });
    }

    log.logger.info("PUT ./place/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.info(`PUT ./place/:id -> ${error.message}`);
  }
};

const getPlaceOcSpecified = async (req, res) => {
  try {
    const id_place = req.params.idPlace;
    const day = req.params.day;
    const Place = await models.Place.findOne({
      include: [
        {
          model: models.Services,
          as: "services",
          attributes: {
            exclude: ["id_place", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.Capster,
          as: "capsters",
          attributes: ["id", "name"],
        },
        {
          model: models.workingTime,
          required: false,
          as: "workingTime",
          attributes: {
            exclude: ["id", "id_place", "createdAt", "updatedAt"],
          },
          where: { day: day },
        },
      ],
      where: { id: id_place },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (Place != null) {
      // send response
      res.status(200).send({
        status: true,
        message: `Successfully get mitra data`,
        data: Place,
      });
    } else {
      // send response
      res.status(404).send({
        status: false,
        message: `Mitra data not found`,
      });
    }
    log.logger.info("GET ./place/:idPlace/:day is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./place/:idPlace/:day -> ${error.message}`);
  }
};

const getPlaceById = async (req, res) => {
  try {
    const id = req.params.id;
    const Place = await models.Place.findOne({
      include: [
        {
          model: models.Services,
          as: "services",
          attributes: {
            exclude: ["id_place", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.Capster,
          as: "capsters",
          attributes: ["id", "name"],
        },
        {
          model: models.workingTime,
          as: "workingTime",
          attributes: {
            exclude: ["id_place", "createdAt", "updatedAt"],
          },
        },
      ],
      where: { id: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (Place) {
      // send response
      res.status(200).send({
        status: true,
        message: `Successfully get mitra data`,
        data: Place,
      });
    } else {
      // send response
      res.status(404).send({
        status: false,
        message: `Mitra data not found`,
      });
    }
    log.logger.info("GET ./place/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./place/:id -> ${error.message}`);
  }
};

// delete
const deletePlace = async (req, res) => {
  try {
    const id = req.params.id;
    // cek apakah id yang dimasukkan ada atau tidak
    const isId = await models.Place.findOne({
      where: {
        id: id,
      },
    });
    if (isId) {
      await models.Place.destroy({
        where: {
          id: id,
        },
      });

      if (!isId.dataValues.img) {
        console.log("No image data");
      } else {
        const pathDelete = "./" + isId.dataValues.img;
        fs.unlink(pathDelete, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Image has been deleted");
        });
      }

      res.status(200).send({
        status: true,
        message: "Place data has been deleted",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Place data not found",
      });
    }

    log.logger.info("DELETE ./place/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`DELETE ./place/:id -> ${error.message}`);
  }
};

module.exports = {
  createPlace,
  getAllPlace,
  getPlaceOcSpecified,
  getPlaceById,
  updatePlace,
  deletePlace,
};
