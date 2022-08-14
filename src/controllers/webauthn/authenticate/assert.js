const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:authenticate:assert`
);

module.exports = async function assert(req, res, next) {
  debug(`Evaluating`);
  const { credential, identity, userId } = res.locals;
  if (!identity) {
    return next(createError(400, `Identity ID '${userId}' not found.`));
  }
  try {
    if (!identity.validChallenge(credential)) {
      return next(createError(400, `Invalid challenge.`));
    }
    await identity.removeChallenge(credential);
    const { id } = credential;
    const { signCount } =
      res.locals.credential.response.authenticatorDataObject;
    if (identity.credential(id).signCountLTET(signCount)) {
      return next(createError(400, `Inconsistent signature count.`));
    }
    await identity.credential(id).setSignCount(signCount);
    // Recommendation: middleware to log events
    const { EXAT, token } = await identity.generateAccessToken();
    // Recommendation: cache token in memory cache
    debug(`Complete`);
    res.json({ token });
  } catch (error) {
    if (identity.validChallenge(credential)) {
      await identity.removeChallenge(credential);
    }
    next(createError(500, error));
  }
};
