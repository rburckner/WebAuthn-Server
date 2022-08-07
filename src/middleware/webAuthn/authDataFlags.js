const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:authDataFlags`
);

exports.verifyAuthDataFlagsUserPresentFromAttestationObject =
  function verifyAuthDataFlagsUserPresentFromAttestationObject(req, res, next) {
    const { UP } =
      res.locals.credential.response.attestationObject.authData.flags;
    debug("verifyAuthDataFlagsUserPresentFromAttestationObject", UP);
    if (!UP) {
      return next(createError(400, `User must be present to authenticate.`));
    }
    next();
  };

exports.verifyAuthDataFlagsUserVerificationFromAttestationObject =
  function verifyAuthDataFlagsUserVerificationFromAttestationObject(
    req,
    res,
    next
  ) {
    const { UV } =
      res.locals.credential.response.attestationObject.authData.flags;
    debug("verifyAuthDataFlagsUserVerificationFromAttestationObject", UV);
    if (!UV) {
      return next(createError(400, `User verification is required.`));
    }
    next();
  };

exports.verifyAuthDataFlagsUserPresentFromResponse =
  function verifyAuthDataFlagsUserPresentFromResponse(req, res, next) {
    const { UP } = res.locals.credential.response.authenticatorDataObject.flags;
    debug("verifyAuthDataFlagsUserPresentFromResponse", UP);
    if (!UP) {
      return next(createError(400, `User must be present to authenticate.`));
    }
    next();
  };

exports.verifyAuthDataFlagsUserVerificationFromResponse =
  function verifyAuthDataFlagsUserVerificationFromResponse(req, res, next) {
    const { UV } = res.locals.credential.response.authenticatorDataObject.flags;
    debug("verifyAuthDataFlagsUserVerificationFromResponse", UV);
    if (!UV) {
      return next(createError(400, `User verification is required.`));
    }
    next();
  };
