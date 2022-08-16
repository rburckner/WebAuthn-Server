const config = require("config");
const createError = require("http-errors");

const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:basic`
);

module.exports = {};
