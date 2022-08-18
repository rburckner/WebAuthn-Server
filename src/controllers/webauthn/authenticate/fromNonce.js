const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:authenticate:fromNonce`
);

module.exports = async function create(req, res, next) {
  debug(`Start`);
  try {
    const { identity } = res.locals;
    res.json({
      publicKey: await identity.createLoginChallenge(),
      userId: identity.id,
    });
  } catch (error) {
    next(createError(500, error));
  }
};
