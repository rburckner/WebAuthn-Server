const { Router } = require("express");

const {
  decorateLocalObject,
  decorateRemoteAddress,
  decorateIdentityFromBody,
} = require("../middleware/common");
const {
  decorateAssertionLocals,
  decorateAttestationLocals,
  evaluateClientExtensions,
  validClientExtensions,
  validAuthenticationAssertion,
  validateRegistrationAttestation,
  verifyClientChallengeTypeIsCreate,
  verifyClientChallengeTypeIsGet,
  verifyClientChallengeOrigin,
  verifyRelyingPartyIdHashFromAttestation,
  verifyRelyingPartyIdHashFromResponse,
  verifyPublicKeyAlgortithm,
  verifyAuthDataFlagsUserPresentFromAttestationObject,
  verifyAuthDataFlagsUserPresentFromResponse,
} = require("../middleware/webAuthn");
const { decorateIdentityByNonce } = require("../middleware/nonce");
const { nonce, webauthn } = require("../controllers");

const router = Router();
router.all(decorateLocalObject, decorateRemoteAddress);

router
  .route("/nonce/registration/request")
  .post(decorateIdentityFromBody, nonce.generateNonce);

router
  .route("/webauthn/authenticate/request")
  .post(decorateIdentityFromBody, webauthn.authenicate.request);

router.route("/webauthn/authenticate/assert").post(
  validAuthenticationAssertion,
  decorateAssertionLocals,
  decorateIdentityFromBody,
  // verify authentication assertion
  verifyClientChallengeTypeIsGet,
  verifyClientChallengeOrigin,
  verifyRelyingPartyIdHashFromResponse,
  verifyAuthDataFlagsUserPresentFromResponse,
  // extensions
  validClientExtensions,
  evaluateClientExtensions,
  // controller
  webauthn.authenicate.assert
);

router
  .route("/webauthn/authenticate/request/from/nonce")
  .post(decorateIdentityByNonce, webauthn.authenicate.fromNonce);

router.route("/webauthn/register/attest").post(
  validateRegistrationAttestation,
  decorateAttestationLocals,
  decorateIdentityFromBody,
  // verify credential attestation
  verifyClientChallengeTypeIsCreate,
  verifyClientChallengeOrigin,
  verifyRelyingPartyIdHashFromAttestation,
  verifyPublicKeyAlgortithm,
  verifyAuthDataFlagsUserPresentFromAttestationObject,
  // extensions
  validClientExtensions,
  evaluateClientExtensions,
  // controller
  webauthn.register.attest
);
router.route("/webauthn/register/request").get(webauthn.register.create);
module.exports = router;
