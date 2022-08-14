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
  const { id, response, type, userId } = req.body;
  if (typeof id !== "string") {
    message = "Request body requires 'id'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof response !== "object") {
    message = "Request body requires 'response'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof type !== "string") {
    message = "Request body requires 'type'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof userId !== "string") {
    message = "Request body requires 'userId'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  const { authenticatorData, clientDataJSON, signature } = response;
  if (typeof authenticatorData !== "string") {
    message = "Request body.response requires 'authenticatorData'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof clientDataJSON !== "string") {
    message = "Request body.response requires 'clientDataJSON'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  if (typeof signature !== "string") {
    message = "Request body.response requires 'clientDataJSON'";
    debug("validAuthenticationAssertion", message);
    return next(createError(400, message));
  }
  next();
};
