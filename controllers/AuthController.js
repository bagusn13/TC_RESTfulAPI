require("dotenv").config();
const express = require("express");
const log = require("../logger");
const models = require("../models");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const otp = require("../helper/otp");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataUser = await models.User.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (dataUser) {
      // jika data usernya ada
      const passwordUser = await bcryptjs.compare(password, dataUser.password);
      if (passwordUser) {
        // jika passwordnya bener
        const data = {
          email: dataUser.email,
          name: dataUser.firstName + dataUser.lastName,
        };
        const accessToken = await jsonwebtoken.sign(
          data,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10m" }
        );
        const refreshToken = await jsonwebtoken.sign(
          data,
          process.env.REFRESH_TOKEN_SECRET
        );

        const saveRetoken = await models.Auth.create({
          refresh_token: refreshToken,
        });

        res.status(200).send({
          status: true,
          message: "You are successfully logged in",
          access_token: accessToken,
          refresh_token: refreshToken,
          data: dataUser,
        });
      } else {
        res.status(403).send({
          status: false,
          message: "Password incorrect",
        });
      }
    } else {
      res.status(400).send({
        status: false,
        message: "Email is not registered",
      });
    }
    log.logger.info("POST ./auth/signin is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./auth/signin -> ${error.message}`);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    // cek di db refresh tokennya match ga
    const isToken = await models.Auth.findOne({
      where: {
        refresh_token: refresh_token,
      },
    });

    if (!refresh_token) {
      return res.status(401).json({
        status: "false",
        message: "Access denied. No token provided",
      });
    }

    // cek refresh tokennya ada ga di db
    if (!isToken) {
      return res.status(401).json({
        status: "false",
        message: "Unauthorized access",
      });
    }

    jsonwebtoken.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          return res.status(403).json({
            status: "false",
            message: "Invalid token",
          });
        }
        const accessToken = jsonwebtoken.sign(
          {
            email: user.email,
            name: user.firstName + user.lastName,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10m" }
        );
        res.status(200).send({
          status: true,
          message: "New access token",
          access_token: accessToken,
        });
      }
    );
    log.logger.info("POST ./auth/refreshtoken is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./auth/refreshtoken -> ${error.message}`);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const isToken = await models.Auth.findOne({
      where: {
        refresh_token: refresh_token,
      },
    });

    if (!refresh_token) {
      return res.status(404).json({
        status: "false",
        message: "Field refresh token is empty",
      });
    }

    if (!isToken) {
      return res.status(401).json({
        status: "false",
        message: "Wrong refresh token",
      });
    }

    // delete refresh token yang ada di db
    await models.Auth.destroy({
      where: {
        refresh_token: refresh_token,
      },
    });

    res.status(200).send({
      status: true,
      message: "You have been successfully logged out",
    });

    log.logger.info("POST ./auth/signout is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./auth/signout -> ${error.message}`);
  }
};

const otpRegister = async (req, res) => {
  try {
    otp.createOtp(req.body, (error, results) => {
      if (error) {
        res.status(500).send({
          status: false,
          message: "Failed",
          data: error,
        });
      } else {
        res.status(200).send({
          status: true,
          message: "Success",
          data: results,
        });
      }
    });
    log.logger.info("POST ./auth/otpregister is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./auth/otpregister -> ${error.message}`);
  }
};

const verifyOtp = async (req, res) => {
  try {
    otp.verifyOtp(req.body, (error, results) => {
      if (error) {
        res.status(500).send({
          status: false,
          message: error,
        });
      } else {
        res.status(200).send({
          status: true,
          message: results,
        });
      }
    });
    log.logger.info("POST ./auth/verifyotp is accessed");
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
    log.logger.fatal(`POST ./auth/verifyotp -> ${error.message}`);
  }
};

module.exports = {
  loginUser,
  refreshToken,
  logoutUser,
  otpRegister,
  verifyOtp,
};
