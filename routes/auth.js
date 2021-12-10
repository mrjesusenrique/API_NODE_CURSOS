"use strict";

const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");

router.post("/", async (req, resp) => {
  const email = req.body.email;
  const password = req.body.password;
  const validUser = await Usuario.findOne({ email });

  try {
    if (validUser) {
      const validPassword = await bcrypt.compareSync(
        password,
        validUser.password
      );
      validPassword
        ? resp.status(200).send({
            status: "success",
            message: "Login correcto",
            validUser,
          })
        : resp.status(400).send({
            status: "error",
            message: "Email o password incorrecto",
          });
    } else {
      resp.status(400).send({
        status: "error",
        message: `Email o password incorrecto`,
      });
    }
  } catch (error) {
    resp.status(400).send({
      status: "error",
      message: `Error en el servicio: ${error}`,
    });
  }
});

module.exports = router;
