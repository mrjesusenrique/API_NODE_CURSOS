"use strict";

const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const Joi = require("joi");

const validateSchema = Joi.object({
  nombre: Joi.string().min(2).max(99).required(),
  apellido: Joi.string().min(2).max(99).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "org"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  estado: Joi.boolean().default(true),
});

router.get("/", async (req, resp) => {
  const usuarios = await Usuario.find().select({
    nombre: 1,
    apellido: 1,
    email: 1,
    estado: 1,
  });

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
  const id = req.params.id;
  const usuario = await Usuario.findById(id).select({
    nombre: 1,
    apellido: 1,
    email: 1,
    estado: 1,
  });

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
  const newEmail = req.body.email;
  const userEmail = await Usuario.findOne({ email: newEmail });

  if (userEmail) {
    resp.status(400).send({
      status: "error",
      message: "El email ingresado ya está registrado en la Base de Datos",
    });
  } else {
    const { error } = validateSchema.validate({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      password: req.body.password,
    });

    if (!error) {
      const usuario = new Usuario({
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
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
          },
        });
      } catch (err) {
        resp.status(400).send({
          status: "error",
          message: `Error al crear el usuario (err): ${err}`,
        });
      }
    } else {
      resp.status(400).send({
        status: "error",
        message: `Error al crear el usuario: ${error}`,
      });
    }
  }
});

router.put("/:id", async (req, resp) => {
  const id = req.params.id;
  const newEmail = req.body.email;
  const userEmail = await Usuario.findOne({ email: newEmail });

  if (userEmail) {
    resp.status(400).send({
      status: "error",
      message:
        "Error al actualizar el usuario. El email ingresado ya está registrado en la Base de Datos",
    });
  } else {
    const { error } = validateSchema.validate({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      password: req.body.password,
    });

    if (!error) {
      const usuario = await Usuario.findByIdAndUpdate(
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
            usuario: {
              id: usuario.id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
            },
          })
        : resp.status(404).send({
            status: "error",
            message: `Error al actualizar el usuario. No existe usuario registrado con el ID proporcionado`,
          });
    } else {
      resp.status(404).send({
        status: "error",
        message: `Error al actualizar el usuario: ${error}`,
      });
    }
  }
});

router.delete("/:id", async (req, resp) => {
  const id = req.params.id;
  const usuario = await Usuario.findByIdAndDelete(id);

  !usuario
    ? resp.status(400).send({
        status: "error",
        message: `Error al eliminar el usuario. No existe usuario registrado con el ID proporcionado`,
      })
    : resp.status(200).send({
        status: "success",
        message: "Usuario eliminado de manera exitosa",
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
        },
      });
});

module.exports = router;
