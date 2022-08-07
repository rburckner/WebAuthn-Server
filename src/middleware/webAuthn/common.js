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
  const { credential } = req.body;
  try {
    res.locals.credential = await parseRegisterRequest(credential);
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
  const { credential } = req.body;
  try {
    res.locals.credential = await parseAuthenticationAssertion(credential);
    next();
  } catch (error) {
    next(createError(error));
  }
};
