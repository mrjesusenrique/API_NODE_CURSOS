"use strict";

const express = require("express");
const router = express.Router();
const Curso = require("../models/Curso");
const Joi = require("joi");

const validateSchema = Joi.object({
  titulo: Joi.string().min(2).max(99).required(),
  descripcion: Joi.string().min(2).max(99).required(),
  estado: Joi.boolean().default(true),
  imagen: Joi.string(),
  alumnos: Joi.number(),
  calificacion: Joi.number(),
});

router.get("/", async (req, resp) => {
  const cursos = await Curso.find();

  !cursos
    ? resp.status(404).send({
        status: "error",
        message: "No se ha encontrado cursos registrados",
      })
    : resp.status(200).send({
        status: "success",
        message: "Cursos encontrados de manera exitosa",
        cursos,
      });
});

router.get("/:id", async (req, resp) => {
  const id = req.params.id;
  const curso = await Curso.findById(id);

  !curso.estado === true
    ? resp.status(404).send({
        status: "error",
        message:
          "No se ha encontrado curso activo asociado al ID proporcionado",
      })
    : resp.status(200).send({
        status: "success",
        message: "Curso encontrado de manera exitosa",
        curso,
      });
});

router.post("/", async (req, resp) => {
  const { error, value } = validateSchema.validate({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    imagen: req.body.imagen,
    alumnos: req.body.alumnos,
    calificacion: req.body.calificacion,
  });

  if (!error) {
    const curso = new Curso({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
      imagen: req.body.imagen,
      alumnos: req.body.alumnos,
      calificacion: req.body.calificacion,
    });

    try {
      await curso.save();

      resp.status(200).send({
        status: "success",
        message: "Curso guardado de manera exitosa",
        curso,
        value,
      });
    } catch (err) {
      resp.status(400).send({
        status: "error",
        message: `Error al crear el curso (err): ${err}`,
      });
    }
  } else {
    resp.status(400).send({
      status: "error",
      message: `Error al crear el curso: ${error}`,
    });
  }
});

router.put("/:id", async (req, resp) => {
  const id = req.params.id;

  const { error, value } = validateSchema.validate({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    imagen: req.body.imagen,
    alumnos: req.body.alumnos,
    calificacion: req.body.calificacion,
  });

  if (!error) {
    const curso = await Curso.findByIdAndUpdate(
      id,
      {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        estado: req.body.estado,
        imagen: req.body.imagen,
        alumnos: req.body.alumnos,
        calificacion: req.body.calificacion,
      },
      { new: true }
    );

    curso
      ? resp.status(200).send({
          status: "success",
          message: "Curso actualizado de manera exitosa",
          curso,
          value,
        })
      : resp.status(404).send({
          status: "error",
          message: `Error al actualizar el curso. No existe curso registrado con el ID proporcionado`,
        });
  } else {
    resp.status(404).send({
      status: "error",
      message: `Error al actualizar el curso: ${error}`,
    });
  }
});

router.delete("/:id", async (req, resp) => {
  const id = req.params.id;
  const curso = await Curso.findByIdAndDelete(id);

  !curso
    ? resp.status(400).send({
        status: "error",
        message: `Error al eliminar el curso. No existe curso registrado con el ID proporcionado`,
      })
    : resp.status(200).send({
        status: "success",
        message: "Curso eliminado de manera exitosa",
        curso,
      });
});

module.exports = router;
