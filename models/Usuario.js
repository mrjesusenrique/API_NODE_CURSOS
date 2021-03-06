"use strict";

const mongoose = require("mongoose");

const usuarioSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 99,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 99,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
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
});

module.exports = mongoose.model("Usuario", usuarioSchema);
