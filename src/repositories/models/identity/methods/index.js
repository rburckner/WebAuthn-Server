const common = require("./common");
const jwt = require("./jwt");
const nonce = require("./nonce");
const webauthn = require("./webauthn");

module.exports = {
  ...common,
  ...jwt,
  ...nonce,
  ...webauthn,
};
