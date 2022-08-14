const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:common`
);

const {
  parseRegisterRequest,
  parseAuthenticationAssertion,
} = require("../../utils/webauthn");

exports.decorateAttestationLocals = async function decorateAttestationLocals(
  req,
  res,
  next
) {
  debug("decorateAttestationLocals");
  try {
    res.locals.credential = await parseRegisterRequest(req.body);
    next();
  } catch (error) {
    next(createError(error));
  }
};

exports.decorateAssertionLocals = async function decorateAttestationLocals(
  req,
  res,
  next
) {
  debug("decorateAssertionLocals");
  try {
    res.locals.credential = await parseAuthenticationAssertion(req.body);
    next();
  } catch (error) {
    next(createError(error));
  }
};
