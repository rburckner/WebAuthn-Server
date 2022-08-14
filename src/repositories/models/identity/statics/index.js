const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:statics`
);

const webauthn = require("./webauthn");

async function CreateIdentity() {
  const doc = new this();
  debug(`New Identity created. ID: ${doc.id}`);
  return await doc.save();
}

module.exports = {
  CreateIdentity,
  ...webauthn,
};
