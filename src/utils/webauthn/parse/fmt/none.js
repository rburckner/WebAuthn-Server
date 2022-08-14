"use strict";
const { decodeFirst } = require("cbor");

const { ParseAuthenticatorData } = require("../authenticatorData");

async function ParseNoneAttestationObject(cborDecoded, clientDataJSON) {
  const { authData } = cborDecoded;
  const { aaguid, COSEPublicKey, credentialId, flags, rpIdHash, signCount } =
    ParseAuthenticatorData(authData);
  const decodedCOSEPublicKeyMap = await decodeFirst(COSEPublicKey);
  const attestationObj = { ...cborDecoded };
  attestationObj.authData = {
    credentialData: {
      aaguid: aaguid.toString("base64"),
      COSEPublicKey: COSEPublicKey.toString("base64"),
      COSEPublicKeyObject: Object.fromEntries(decodedCOSEPublicKeyMap),
      credentialId: credentialId.toString("base64"),
    },
    flags,
    rpIdHash: rpIdHash.toString("base64"),
    signCount,
  };
  return attestationObj;
}

module.exports = { ParseNoneAttestationObject };
