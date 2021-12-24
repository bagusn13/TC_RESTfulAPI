require("dotenv").config();
const express = require("express");
const models = require("../models");
const bcryptjs = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// READ
const getAllUser = async (req, res) => {
  try {
    const User = await models.User.findAll({});

    res.status(200).send({
      status: true,
      message: "Successfully get all user data",
      data: User,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// READ BY ID
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await models.User.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    if (User) {
      res.status(200).send({
        status: true,
        message: `Successfully get user data`,
        data: User,
      });
    } else {
      res.status(404).send({
        status: false,
        message: `User not found`,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// CREATE USER WITH IMG
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;
    const emailUser = await models.User.findOne({
      where: {
        email: email,
      },
    });

    //cek apakah email yang dimasukkan sudah terdaftar atau belum
    if (emailUser) {
      fs.unlink("./" + pathRaw.replace(/\\/g, path.sep), (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Upload failed. An error occured in the controller");
      });

      res.status(409).send({
        status: false,
        message: "Email already used",
      });
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const User = await models.User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        phone: phone,
        role: role,
        img: pathRaw.replace(/\\/g, path.sep),
      });

      res.status(200).send({
        status: true,
        message: "Congratulations, your account has been successfully created",
        data: User,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const createUserWithoutImg = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    const emailUser = await models.User.findOne({
      where: {
        email: email,
      },
    });

    //cek apakah email yang dimasukkan sudah terdaftar atau belum
    if (emailUser) {
      res.status(409).send({
        status: false,
        message: "Email already used",
      });
    } else {
      const hashPassword = await bcryptjs.hash(password, 10);
      const User = await models.User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        phone: phone,
        role: role,
      });

      res.status(200).send({
        status: true,
        message: "Congratulations, your account has been successfully created",
        data: User,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// UPDATE USER WITH IMG
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, password, phone, role } = req.body;
    path.sep = "/";
    const pathRaw = req.file.path;

    const isId = await models.User.findOne({
      where: {
        id: id,
      },
    });

    // cek apakah id yang dimasukkan ada atau tidak
    if (isId) {
      if (!password) {
        const User = await models.User.update(
          {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            role: role,
            img: pathRaw.replace(/\\/g, path.sep),
          },
          {
            where: {
              id: id,
            },
          }
        );
      } else {
        const hashPassword = await bcryptjs.hash(password, 10);
        const User = await models.User.update(
          {
            firstName: firstName,
            lastName: lastName,
            password: hashPassword,
            phone: phone,
            role: role,
            img: pathRaw.replace(/\\/g, path.sep),
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      if (!isId.dataValues.img) {
        console.log("No image data");
      } else {
        const pathDelete = "./" + isId.dataValues.img;
        fs.unlink(pathDelete, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Image has been replaced");
        });
      }

      res.status(200).send({
        status: true,
        message: "Data has been updated successfully",
      });
    } else {
      fs.unlink("./" + pathRaw.replace(/\\/g, path.sep), (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Upload failed. An error occured in the controller");
      });
      res.status(404).send({
        status: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const updateUserWithoutImg = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, password, phone, role } = req.body;

    // cek apakah id yang dimasukkan ada atau tidak
    const isId = await models.User.findOne({
      where: {
        id: id,
      },
    });

    if (isId) {
      if (!password) {
        const User = await models.User.update(
          {
            firstName: firstName,
            lastName: lastName,
            password: password,
            phone: phone,
            role: role,
          },
          {
            where: {
              id: id,
            },
          }
        );
        console.log("password ga diisi");
      } else {
        const hashPassword = await bcryptjs.hash(password, 10);
        const User = await models.User.update(
          {
            firstName: firstName,
            lastName: lastName,
            password: hashPassword,
            phone: phone,
            role: role,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }

      res.status(200).send({
        status: true,
        message: "Data has been updated successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    // cek apakah id yang dimasukkan ada atau tidak
    const isId = await models.User.findOne({
      where: {
        id: id,
      },
    });
    if (isId) {
      await models.User.destroy({
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
        message: "Data has been deleted",
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Data not found",
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
  getAllUser,
  getUserById,
  createUser,
  createUserWithoutImg,
  updateUser,
  updateUserWithoutImg,
  deleteUser,
};
