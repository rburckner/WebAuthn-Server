const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:nonce`
);

exports.generateNonce = async function generateNonce(req, res, next) {
  //if authenticted, valid session token
  debug(`Evaluating`);
  let nonce = "";
  const { identity } = res.locals;
  if (!identity) {
    return next(createError(400, `Identity not found`));
  }
  try {
    debug(`Found ID`);
    nonce = await identity.generateNonce();
    res.json({ nonce });
  } catch (error) {
    if (nonce) {
      await identity.removeNonce(nonce);
    }
    next(createError(500, error));
  }
};
