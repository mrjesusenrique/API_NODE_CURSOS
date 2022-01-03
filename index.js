"use strict";

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const usuarios = require("./routes/usuarios");
const cursos = require("./routes/cursos");
const auth = require("./routes/auth");
const config = require("config");
const HOST = config.get("configDB.HOST");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/usuarios", usuarios);
app.use("/api/cursos", cursos);
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log(`API Rest escuchando en el puerto ${port}`);
});

mongoose
  .connect(HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("La conexión a la Base de Datos se ha realizado con éxito")
  )
  .catch((error) =>
    console.log(
      `Ha ocurrido un error al intentar conectar con la Base de Datos: ${error}`
    )
  );
