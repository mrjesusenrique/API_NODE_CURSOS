"use strict";

const jwt = require("jsonwebtoken");
const config = require("config");
const verifyToken = config.get("configToken.SEED");

const verificarToken = (req, resp, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, verifyToken, (err, decoded) => {
    err
      ? resp.status(401).send({
          status: "error",
          message: "Authorization Token inválido",
        })
      : (req.usuario = decoded.usuario);
    next();
  });
};

module.exports = verificarToken;
