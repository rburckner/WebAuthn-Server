"use strict";
const { Router } = require("express");

const {
  decorateDisplayName,
  decorateLocalObject,
  decorateRemoteAddress,
  decorateIdentity,
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

const { webauthn } = require("../controllers");

const router = Router();
router.all(
  decorateLocalObject,
  decorateDisplayName,
  decorateRemoteAddress,
  decorateIdentity
);

router
  .route("/webauthn/authenticate/request")
  .post(webauthn.authenicate.request);

router.route("/webauthn/authenticate/assert").post(
  validAuthenticationAssertion,
  decorateAssertionLocals,
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

router.route("/webauthn/register/attest").post(
  validateRegistrationAttestation,
  decorateAttestationLocals,
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
router.route("/webauthn/register/request").post(webauthn.register.create);
module.exports = router;
