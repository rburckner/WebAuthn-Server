const config = require("config");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:methods:jwt`
);
const createError = require("http-errors");

const { sign } = require("../../../../utils/jwt");
const { expiresInSec } = config.get("jwt");

exports.generateAccessToken = async function generateAccessToken() {
  debug(`generateAccessToken`);
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + expiresInSec * 1000);
  const payload = {};
  const options = {
    subject: this.id,
    expiresIn: parseInt(expiry.getTime() / 1000, 10),
  };
  try {
    debug(`generateAccessToken`);
    return await sign(payload, options);
  } catch (error) {
    throw createError(500, error);
  }
};
