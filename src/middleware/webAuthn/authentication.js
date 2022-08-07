const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:authentication`
);

exports.validAuthenticationAssertion = function validAuthenticationAssertion(
  req,
  res,
  next
) {
  debug("validAuthenticationAssertion");
  let message = "";
  const { authenticatorAttachment, id, response, type } = req.body.credential;
  if (typeof authenticatorAttachment !== "string") {
    message = "Request body.credential requires 'authenticatorAttachment'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof id !== "string") {
    message = "Request body.credential requires 'id'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof response !== "object") {
    message = "Request body.credential requires 'response'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof authenticatorAttachment !== "string") {
    message = "Request body.credential requires 'authenticatorAttachment'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof type !== "string") {
    message = "Request body.credential requires 'type'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  const { authenticatorData, clientDataJSON, signature } = response;
  if (typeof authenticatorData !== "string") {
    message = "Request body.credential.response requires 'authenticatorData'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof clientDataJSON !== "string") {
    message = "Request body.credential.response requires 'clientDataJSON'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof signature !== "string") {
    message = "Request body.credential.response requires 'clientDataJSON'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  next();
};
