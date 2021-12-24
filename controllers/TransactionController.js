require("dotenv").config();
const express = require("express");
const models = require("../models");

const createTransaction = async (req, res) => {
  try {
    const { id_user, id_service, id_appoint, hash, service, harga } = req.body;

    const Transaction = await models.Transaction.create({
      id_user: id_user,
      id_service: id_service,
      id_appoint: id_appoint,
      hash: hash,
      service: service,
      harga: harga,
    });

    res.status(200).send({
      status: true,
      message: "Transaction data added successfully",
      data: Transaction,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = { createTransaction };
