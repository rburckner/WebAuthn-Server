const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:statics`
);

const webauthn = require("./webauthn");

async function CreateIdentity({ username, displayName }) {
  displayName = displayName || username;
  debug(`Creating new identity for displayName: ${displayName}`);
  const nameExists = (await this.find({ displayName })).length > 0;
  if (nameExists) {
    throw createError(400, `Display name is taken.`);
  }
  const doc = new this({ displayName });
  return await doc.save();
}

module.exports = {
  CreateIdentity,
  ...webauthn,
};
