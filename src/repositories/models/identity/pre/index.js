"use strict";
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:pre`
);

module.exports = (schema) => {
  schema.pre("validate", function (next) {
    if (!this.name) {
      this.name = this.displayName.split(" ")[0];
      debug(`Identity: ${this.id} - Substitued name as ${this.name}`);
    }
    next();
  });
};
