"use strict";

const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

router.get("/", (req, resp) => {
  resp.json("Listo el get de usuarios");
});

router.post("/", async (req, resp) => {
  let usuario = new Usuario({
    email: req.body.email,
    nombre: req.body.nombre,
    password: req.body.password,
  });

  try {
    await usuario.save();

    resp.status(200).send({
      status: "success",
      message: "Usuario guardado de manera exitosa",
      usuario,
    });
  } catch (error) {
    resp.status(400).send({
      status: "error",
      message: `Error al crear el usuario: ${error}`,
    });
  }
});

module.exports = router;
