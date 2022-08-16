const config = require("config");
const debug = require("util").debug(`${process.env.SERVER_NAME}:app`);
const express = require("express");
const morgan = require("morgan");

const app = express();

const routes = require("../routes");
const { RouterErrorHandler, RouteNotFound } = require("../controllers/errors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.get("logging.morgan.format")));

app.use("/id", routes.id);

app.use(RouteNotFound);
app.use(RouterErrorHandler);
module.exports = app;
