"use strict";

const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

router.get("/", async (req, resp) => {
  let usuarios = await Usuario.find();

  !usuarios
    ? resp.status(404).send({
        status: "error",
        message: "No se ha encontrado usuarios registrados",
      })
    : resp.status(200).send({
        status: "success",
        message: "Usuarios encontrados de manera exitosa",
        usuarios,
      });
});

router.get("/:id", async (req, resp) => {
  let id = req.params.id;
  let usuario = await Usuario.findById(id);

  !usuario.estado === true
    ? resp.status(404).send({
        status: "error",
        message:
          "No se ha encontrado usuario activo asociado al ID proporcionado",
      })
    : resp.status(200).send({
        status: "success",
        message: "Usuario encontrado de manera exitosa",
        usuario,
      });
});

router.post("/", async (req, resp) => {
  let usuario = new Usuario({
    email: req.body.email,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
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

router.put("/:id", async (req, resp) => {
  let id = req.params.id;

  let usuario = await Usuario.findByIdAndUpdate(
    id,
    {
      email: req.body.email,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      password: req.body.password,
    },
    { new: true }
  );

  usuario
    ? resp.status(200).send({
        status: "success",
        message: "Usuario actualizado de manera exitosa",
        usuario,
      })
    : resp.status(404).send({
        status: "error",
        message: `Error al actualizar el usuario. No existe usuario registrado con el ID proporcionado`,
      });
});

router.delete("/:id", async (req, resp) => {
  let id = req.params.id;
  let usuario = await Usuario.findByIdAndDelete(id);

  !usuario
    ? resp.status(400).send({
        status: "error",
        message: `Error al eliminar el usuario. No existe usuario registrado con el ID proporcionado`,
      })
    : resp.status(200).send({
        status: "success",
        message: "Usuario eliminado de manera exitosa",
        usuario,
      });
});

module.exports = router;
