const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:register:create`
);

const Identity = require("../../../repositories/models/identity");

module.exports = async function create(req, res, next) {
  debug(`Start`);
  try {
    const identity = await Identity.CreateIdentity();
    res.json({
      publicKey: await identity.createCredentialsJSON(),
      userId: identity.id,
    });
  } catch (error) {
    next(createError(500, error));
  }
};
