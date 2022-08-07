"use strict";
const { name } = require("./package.json");
process.env.SERVER_NAME = name;
require("./src");
