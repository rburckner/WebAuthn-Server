/**
 * This config file loads all the 'dotenv' options
 */
"use strict";
require("dotenv").config();
const genRanHex = (size = 32) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const JWT_SECRET = process.env.JWT_SECRET || genRanHex();

module.exports = {
  env: { JWT_SECRET },
};
