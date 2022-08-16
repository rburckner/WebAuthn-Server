const config = require("config");
const jwt = require("jsonwebtoken");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:methods:common`
);
const createError = require("http-errors");

const { JWT_SECRET } = config.get("env");
const { expiresInSec } = config.get("jwt");

exports.generateAccessToken = async function () {
  debug(`generateAccessToken`);
  const expiry = new Date();
  expiry.setTime(expiry.getTime() + expiresInSec * 1000);
  const payload = {
    exp: parseInt(expiry.getTime() / 1000, 10),
  };
  const options = {
    subject: this.id,
  };
  try {
    const token = await jwt.sign(payload, JWT_SECRET, options);
    // EXAT required for REDIS
    return { EXAT: payload.exp, token };
  } catch (error) {
    throw createError(500, error);
  }
};
