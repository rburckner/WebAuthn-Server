const config = require("config");
const createError = require("http-errors");
const { hash } = require("../../utils/crypto");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn`
);

exports.verifyPublicKeyAlgortithm = async function verifyPublicKeyAlgortithm(
  req,
  res,
  next
) {
  const { pubKeyCredParams } = config.get(
    "webauthn.PublicKeyCredentialCreationOptions"
  );
  debug("verifyPublicKeyAlgortithm");
  const { alg } = res.locals.credential.response.attestationObject.attStmt;
  if (!pubKeyCredParams.map((param) => param.alg).includes(alg)) {
    return next(createError(400, `Public Key algorithm not accepted.`));
  }
  next();
};

exports.validateRegistrationAttestation =
  function validateRegistrationAttestation(req, res, next) {
    debug("validateRegistrationAttestation");
    let message = "";
    const { authenticatorAttachment, id, response, type } = req.body.credential;
    if (typeof authenticatorAttachment !== "string") {
      message = "Request body requires 'authenticatorAttachment'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    if (typeof id !== "string") {
      message = "Request body requires 'id'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    if (typeof response !== "object") {
      message = "Request body requires 'response'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    if (typeof authenticatorAttachment !== "string") {
      message = "Request body requires 'authenticatorAttachment'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    if (typeof type !== "string") {
      message = "Request body requires 'type'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    const {
      attestationObject,
      clientDataJSON,
      publicKey,
      publicKeyAlgorithm,
      transports,
    } = response;
    if (typeof attestationObject !== "string") {
      message = "Request body.response requires 'attestationObject'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    if (typeof clientDataJSON !== "string") {
      message = "Request body.response requires 'clientDataJSON'";
      debug("validateRegistrationAttestation", message);
      return next(createError(400, message));
    }
    next();
  };

exports.verifyRelyingPartyIdHash = async function verifyRelyingPartyIdHash(
  req,
  res,
  next
) {
  debug("verifyRelyingPartyIdHash");
  console.log(223, res.locals.credential.response);
  const { id } = config.get("webauthn.PublicKeyCredentialCreationOptions.rp");
  const { rpIdHash } =
    res.locals.credential.response.attestationObject.authData;
  if (rpIdHash !== (await hash(id).toString("base64"))) {
    return next(createError(400, `Invalid Relying Party ID Hash.`));
  }
  next();
};
