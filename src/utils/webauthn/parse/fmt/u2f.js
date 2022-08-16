const { decodeFirst } = require("cbor");

const {
  hash,
  convertCOSEPublicKeyToRawPKCSECDHAKey,
  convertASN1toPEM,
  verifySignature,
} = require("../../../crypto");
const { ParseAuthenticatorData } = require("../authenticatorData");

async function ParseU2FAttestationObject(cborDecoded, clientDataJSON) {
  const { attStmt, authData } = cborDecoded;
  const { sig, x5c } = attStmt;
  const { aaguid, COSEPublicKey, credentialId, flags, rpIdHash, signCount } =
    ParseAuthenticatorData(authData);
  const clientDataHash = hash(Buffer.from(clientDataJSON, "base64"));
  const reservedByte = Buffer.from([0x00]);
  const publicKey = await convertCOSEPublicKeyToRawPKCSECDHAKey(COSEPublicKey);
  const decodedCOSEPublicKeyMap = await decodeFirst(COSEPublicKey);
  const signatureBaseBuffer = Buffer.concat([
    reservedByte,
    rpIdHash,
    clientDataHash,
    credentialId,
    publicKey,
  ]);
  const PEMCertificate = convertASN1toPEM(x5c[0]);
  if (!verifySignature(sig, signatureBaseBuffer, PEMCertificate)) {
    throw new Error(`Invalid signature base`);
  }
  const sigB64 = sig.toString("base64");
  const result = { ...cborDecoded };
  result.attStmt = { ...attStmt };
  result.attStmt.sigAB = sig;
  result.attStmt.sig = sigB64;
  result.authData = {
    authDataAB: authData,
    credentialData: {
      aaguid: aaguid.toString("base64"),
      COSEPublicKey: COSEPublicKey.toString("base64"),
      COSEPublicKeyObject: Object.fromEntries(decodedCOSEPublicKeyMap),
      credentialId: credentialId.toString("base64"),
    },
    flags,
    publicKey: publicKey.toString("base64"),
    rpIdHash: rpIdHash.toString("base64"),
    signCount,
  };
  result.attStmt.x5c = [];
  result.attStmt.x5cAB = [];
  x5c.forEach((entry) => {
    result.attStmt.x5cAB.push(entry);
    result.attStmt.x5c.push(entry.toString("base64"));
  });
  return result;
}

module.exports = { ParseU2FAttestationObject };
