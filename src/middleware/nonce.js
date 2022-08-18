const createError = require("http-errors");
const Identity = require("../repositories/models/identity");

const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:nonce`
);

exports.decorateIdentityByNonce = async function decorateIdentityByNonce(
  req,
  res,
  next
) {
  try {
    const { nonce } = req.body;
    if (!nonce) {
      return next(createError(400, `Nonce not present on body object.`));
    }
    debug(`decorateIdentityByNonce - ${nonce}`);
    const identities = await Identity.find();
    const [identity] = identities.filter(
      (identity) =>
        identity.nonces.filter((entry) => entry.nonce === nonce).length
    );
    if (!identity || !identity.validNonce(nonce)) {
      return next(createError(400, `Invalid nonce.`));
    }
    debug(`Identity found - ${identity.id}`);
    await identity.removeNonce(nonce);
    res.locals.identity = identity;
    next();
  } catch (error) {
    next(createError(500, error));
  }
};
