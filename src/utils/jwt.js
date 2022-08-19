const config = require("config");
const jwt = require("jsonwebtoken");
const debug = require("util").debug(`${process.env.SERVER_NAME}:utils:jwt`);

const { JWT_SECRET } = config.get("env");

exports.sign = function sign(payload, options = {}) {
  debug(`signing access token ${JWT_SECRET}`);
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, options, function (error, token) {
      if (error) {
        return reject(error);
      }
      debug(`Sending token: ${token}`);
      // EXAT required for REDIS
      resolve({ EXAT: options.expiresIn, token });
    });
  });
};

exports.verify = function verify(token, options = {}) {
  debug(`verifying access token ${JWT_SECRET}`);
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, options, function (error, payload) {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};
