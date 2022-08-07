const config = require("config");
const createError = require("http-errors");
const { hash } = require("../../utils/crypto");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:authenicationData`
);
exports.verifyRelyingPartyIdHashFromAttestation =
  async function verifyRelyingPartyIdHashFromAttestation(req, res, next) {
    debug("verifyRelyingPartyIdHashFromAttestation");
    const { id } = config.get("webauthn.PublicKeyCredentialCreationOptions.rp");
    const { rpIdHash } =
      res.locals.credential.response.attestationObject.authData;
    if (rpIdHash !== (await hash(id).toString("base64"))) {
      return next(createError(400, `Invalid Relying Party ID Hash.`));
    }
    next();
  };

exports.verifyRelyingPartyIdHashFromResponse =
  async function verifyRelyingPartyIdHashFromResponse(req, res, next) {
    debug("verifyRelyingPartyIdHashFromResponse");
    const { rpIdHash } = res.locals.credential.response.authenticatorDataObject;
    const { rpId } = config.get("webauthn.PublicKeyCredentialRequestOptions");
    if (Buffer.compare(rpIdHash, await hash(rpId)) !== 0) {
      return next(createError(400, `Invalid Relying Party ID Hash.`));
    }
    next();
  };
