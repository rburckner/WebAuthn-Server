const attestationObj = require("./attestationObj");
const authentication = require("./authentication");
const authenticationData = require("./authenticationData");
const authDataFlags = require("./authDataFlags");
const clientData = require("./clientData");
const clientExtensions = require("./clientExtensions");
const common = require("./common");

module.exports = {
  ...attestationObj,
  ...authentication,
  ...authenticationData,
  ...authDataFlags,
  ...clientData,
  ...clientExtensions,
  ...common,
};
