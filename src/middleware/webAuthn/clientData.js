const config = require("config");
const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:clientData`
);

exports.verifyClientChallengeTypeIsCreate =
  function verifyClientChallengeTypeIsCreate(req, res, next) {
    debug("verifyClientChallengeTypeIsCreate");
    const { type } = res.locals.credential.response.clientData;
    if (type !== "webauthn.create") {
      return next(createError(400, `Invalid client data type.`));
    }
    next();
  };

exports.verifyClientChallengeTypeIsGet =
  function verifyClientChallengeTypeIsGet(req, res, next) {
    debug("verifyClientChallengeTypeIsGet");
    const { type } = res.locals.credential.response.clientData;
    if (type !== "webauthn.get") {
      return next(createError(400, `Invalid client data type.`));
    }
    next();
  };

exports.verifyClientChallengeOrigin = function verifyClientChallengeOrigin(
  req,
  res,
  next
) {
  debug("verifyClientChallengeOrigin");
  const { Origin } = config.get("webauthn");
  debug(`Origin loaded as: ${Origin}`);

  const { origin } = res.locals.credential.response.clientData;
  if (origin !== Origin) {
    return next(createError(400, `Invalid client data origin.`));
  }
  next();
};
