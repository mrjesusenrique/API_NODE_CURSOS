"use strict";

const mongoose = require("mongoose");

const cursoSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 99,
  },
  estado: {
    type: Boolean,
    default: true,
    required: false,
  },
  imagen: {
    type: String,
    required: false,
  },
  alumnos: {
    type: Number,
    default: 0,
  },
  calificacion: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Curso", cursoSchema);
