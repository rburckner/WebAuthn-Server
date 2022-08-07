const config = require("config");
const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:register:attest`
);
const { UniqueCredentialIds } = config.get("webauthn");
const Identity = require("../../../repositories/models/identity");

module.exports = async function attestation(req, res, next) {
  debug(`Evaluating`);
  const { displayName, identity, credential } = res.locals;
  if (!identity) {
    return next(
      createError(400, `Identity with Display Name '${displayName}' not found.`)
    );
  }
  try {
    if (!identity.validChallenge(credential)) {
      return next(createError(400, `Invalid challenge.`));
    }
    if (
      UniqueCredentialIds &&
      !(await Identity.UniqueCredentialId(credential))
    ) {
      return next(createError(400, `Credential already in used.`));
    }
    await identity.addCredential(credential);
    await identity.removeChallenge(credential);
    // Recommendation: middleware to log events
    const { EXAT, token } = await identity.generateAccessToken();
    // Recommendation: cache token in memory cache
    debug(`Complete`);
    res.json({ token });
  } catch (error) {
    next(createError(500, error));
  }
};
