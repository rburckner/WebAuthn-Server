"use strict";
const { decodeFirst } = require("cbor");
const { createVerify } = require("crypto");

const {
  hash,
  convertCOSEPublicKeyToRawPKCSECDHAKey,
  convertASN1toPEM,
  getX509CertificateInfo,
} = require("../../../crypto");

const { HASH_ALGO } = require("../../constants");
const { ParseAuthenticatorData } = require("../authenticatorData");

async function ParsePackedAttestationObject(cborDecoded, clientDataJSON) {
  const { attStmt, authData } = cborDecoded;
  const { sig, x5c } = attStmt;
  const { aaguid, COSEPublicKey, credentialId, flags, rpIdHash, signCount } =
    ParseAuthenticatorData(authData);
  const clientDataHash = hash(Buffer.from(clientDataJSON, "base64"));
  const signatureBaseBuffer = Buffer.concat([authData, clientDataHash]);
  const decodedCOSEPublicKeyMap = await decodeFirst(COSEPublicKey);
  const sigB64 = sig.toString("base64");
  const result = { ...cborDecoded };
  result.attStmt = { ...attStmt };
  result.attStmt.sigAB = sig;
  result.attStmt.sig = sigB64;
  result.authData = {
    authDataAB: authData,
    credentialData: {
      aaguid: aaguid.toString("base64"),
      COSEPublicKey: Object.fromEntries(decodedCOSEPublicKeyMap),
      credentialId: credentialId.toString("base64"),
    },
    flags,
    rpIdHash: rpIdHash.toString("base64"),
    signCount,
  };
  if (x5c) {
    const publicKey = await PublicKey(cborDecoded, signatureBaseBuffer, sig);
    result.authData.publicKey = publicKey.toString("base64");
    result.attStmt.x5c = [];
    result.attStmt.x5cAB = [];
    x5c.forEach((entry) => {
      result.attStmt.x5cAB.push(entry);
      result.attStmt.x5c.push(entry.toString("base64"));
    });
  }
  return result;
}

/**
 * Parses verified publicKey.
 * @param  {Object} cborDecoded - CBOR dencoded attestation object
 * @param  {Buffer} signatureBase - Buffer.concat([authData, clientDataHash])
 * @param  {Buffer} signature - Attestation statement signature
 * @return {Buffer}               - RAW PKCS encoded public key
 */
function PublicKey(cborDecoded, signatureBase, signature) {
  const { authData, attStmt, fmt } = cborDecoded;
  const { x5c } = attStmt;
  const { COSEPublicKey } = ParseAuthenticatorData(authData);
  const publicKey = convertCOSEPublicKeyToRawPKCSECDHAKey(COSEPublicKey);
  const leafCert = convertASN1toPEM(x5c[0]);
  const certInfo = getX509CertificateInfo(leafCert);
  const { basicConstraints, subject, version } = certInfo;
  const { C, CN, O, OU } = subject;
  if (OU !== "Authenticator Attestation") {
    throw new Error(
      'Batch certificate OU MUST be set strictly to "Authenticator Attestation"!'
    );
  }
  if (!CN) {
    throw new Error("Batch certificate CN MUST no be empty!");
  }
  if (!O) {
    throw new Error("Batch certificate CN MUST no be empty!");
  }
  if (!C || C.length !== 2) {
    throw new Error(
      "Batch certificate C MUST be set to two character ISO 3166 code!"
    );
  }
  if (basicConstraints && basicConstraints.cA) {
    throw new Error("Batch certificate basic constraints CA MUST be false!");
  }
  if (version !== 3) {
    throw new Error("Batch certificate version MUST be 3(ASN1 2)!");
  }
  const validSignature = createVerify(HASH_ALGO)
    .update(signatureBase)
    .verify(leafCert, signature);

  if (!validSignature) {
    throw new Error("Invalid certificate signature.");
  }
  return publicKey;
}

module.exports = { ParsePackedAttestationObject };
