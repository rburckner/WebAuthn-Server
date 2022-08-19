const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:authenticate:request`
);

module.exports = async function request(req, res, next) {
  debug(`Start`);
  const { identity } = res.locals;
  try {
    res.json(await identity.createLoginChallenge());
  } catch (error) {
    next(createError(500, error));
  }
};
