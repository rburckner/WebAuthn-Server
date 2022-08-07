"use strict";
const parse = require("./parse");

module.exports = {
  parseAuthenticationAssertion: parse.AuthenticationAssertion,
  parseRegisterRequest: parse.RegisterRequest,
};
