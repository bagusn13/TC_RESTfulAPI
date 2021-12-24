require("dotenv").config();
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

const authToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "false",
      message: "Unauthorized access",
    });
  }

  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) {
      return res.status(403).json({
        status: "false",
        message: "Invalid token",
      });
    }
    req.email = email;
    next();
  });
};

module.exports = authToken;
