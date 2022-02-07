require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");
const path = require("path");
const fs = require("fs");

// get all promo
const getAllPromo = async (req, res) => {
  try {
    const { count, rows } = await models.Promo.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (count === 0) {
      res.status(404).send({
        status: false,
        message: "Promo data is empty",
      });
    } else {
      res.status(200).send({
        status: true,
        message: "Successfully get all promo data",
        data: rows,
      });
    }

    log.logger.info("GET ./promo is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./promo -> ${error.message}`);
  }
};

// get promo by id
const getPromoById = async (req, res) => {
  try {
    const id = req.params.id;
    const Promo = await models.Promo.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (Promo) {
      res.status(200).send({
        status: true,
        message: `Successfully get promo data`,
        data: Promo,
      });
    } else {
      res.status(404).send({
        status: false,
        message: `Promo not found`,
      });
    }

    log.logger.info("GET ./promo/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./promo/:id -> ${error.message}`);
  }
};

// get promo by code
const getPromoByCode = async (req, res) => {
  try {
    const code = req.params.code;
    const Promo = await models.Promo.findOne({
      where: {
        code: code,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (Promo) {
      res.status(200).send({
        status: true,
        message: `Successfully get promo data`,
        data: Promo,
      });
    } else {
      res.status(404).send({
        status: false,
        message: `Promo not found`,
      });
    }

    log.logger.info("GET ./promo/code/:code is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`GET ./promo/code/:code -> ${error.message}`);
  }
};

// create promo with img (must)
const createPromo = async (req, res) => {
  try {
    // title string, information text, code string, img string, disc integer
    const { title, information, code, disc } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;
    const Promo = await models.Promo.create({
      title: title,
      information: information,
      code: code,
      img: pathRaw.replace(/\\/g, path.sep),
      disc: disc,
    });

    res.status(200).send({
      status: true,
      message: "Promo data created successfully",
      data: Promo,
    });

    log.logger.info("POST ./promo is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./promo -> ${error.message}`);
  }
};

// update promo with img (must)
const updatePromo = async (req, res) => {
  try {
    // update by id
    const id = req.params.id;
    const { title, information, code, disc } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;

    const isId = await models.Promo.findOne({
      where: {
        id: id,
      },
    });

    // cek apakah id yang dimasukkan ada atau tidak
    if (isId) {
      // proses update
      const Promo = await models.Promo.update(
        {
          title: title,
          information: information,
          code: code,
          disc: disc,
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
        message: "Promo data has been updated successfully",
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
        message: "Promo not found",
      });
    }

    log.logger.info("PUT ./promo/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.info(`PUT ./promo/:id -> ${error.message}`);
  }
};

// delete promo
const deletePromo = async (req, res) => {
  try {
    const id = req.params.id;
    // cek apakah id yang dimasukkan ada atau tidak
    const isId = await models.Promo.findOne({
      where: {
        id: id,
      },
    });
    if (isId) {
      await models.Promo.destroy({
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
        message: "Promo data has been deleted",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Promo not found",
      });
    }

    log.logger.info("DELETE ./promo/:id is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`DELETE ./promo/:id -> ${error.message}`);
  }
};

module.exports = {
  createPromo,
  getAllPromo,
  getPromoById,
  getPromoByCode,
  deletePromo,
  updatePromo,
};
