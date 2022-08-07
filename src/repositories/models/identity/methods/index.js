"use strict";
const common = require("./common");
const webauthn = require("./webauthn");

module.exports = {
  ...common,
  ...webauthn,
};
