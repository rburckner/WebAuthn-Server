"use strict";
const { decodeFirst } = require("cbor");
const { createHash, createVerify, randomBytes } = require("crypto");
const { X509 } = require("jsrsasign");
const { HASH_ALGO } = require("./webauthn/constants");

/**
 * Returns a digest of the given data.
 */
function hash(data, alg = HASH_ALGO) {
  return createHash(alg).update(data).digest();
}

/**
 * Convert binary certificate or public key to an OpenSSL-compatible PEM text format.
 */
function convertASN1toPEM(pkBuffer) {
  if (!Buffer.isBuffer(pkBuffer)) {
    throw new Error("ASN1toPEM: pkBuffer must be Buffer.");
  }

  let type;
  if (pkBuffer.length === 65 && pkBuffer[0] === 0x04) {
    /*
          If needed, we encode rawpublic key to ASN structure, adding metadata:
          SEQUENCE {
            SEQUENCE {
               OBJECTIDENTIFIER 1.2.840.10045.2.1 (ecPublicKey)
               OBJECTIDENTIFIER 1.2.840.10045.3.1.7 (P-256)
            }
            BITSTRING <raw public key>
          }
          Luckily, to do that, we just need to prefix it with constant 26 bytes (metadata is constant).
      */
    pkBuffer = Buffer.concat([
      Buffer.from(
        "3059301306072a8648ce3d020106082a8648ce3d030107034200",
        "hex"
      ),
      pkBuffer,
    ]);
    type = "PUBLIC KEY";
  } else {
    type = "CERTIFICATE";
  }

  const b64cert = pkBuffer.toString("base64");
  const PEMKeyMatches = b64cert.match(/.{1,64}/g);
  if (!PEMKeyMatches) {
    throw new Error("Invalid key");
  }
  const PEMKey = PEMKeyMatches.join("\n");
  return `-----BEGIN ${type}-----\n` + PEMKey + `\n-----END ${type}-----\n`;
}

/**
 * Parses COSE encoded public key
 * @param  {Buffer} cosePublicKey - COSE encoded public key
 * @return {Object}               -
 */
async function convertCOSEPublicKeyToObject(cosePublicKey) {
  /* 
    +------+-------+-------+---------+----------------------------------+
    | name | key   | label | type    | description                      |
    |      | type  |       |         |                                  |
    +------+-------+-------+---------+----------------------------------+
    | crv  | 2     | -1    | int /   | EC Curve identifier - Taken from |
    |      |       |       | tstr    | the COSE Curves registry         |
    |      |       |       |         |                                  |
    | x    | 2     | -2    | bstr    | X Coordinate                     |
    |      |       |       |         |                                  |
    | y    | 2     | -3    | bstr /  | Y Coordinate                     |
    |      |       |       | bool    |                                  |
    |      |       |       |         |                                  |
    | d    | 2     | -4    | bstr    | Private key                      |
    +------+-------+-------+---------+----------------------------------+
    */

  return Object.fromEntries(await cbor.decodeFirst(cosePublicKey));
}

/**
 * Takes COSE encoded public key and converts it to RAW PKCS ECDHA key
 * @param  {Buffer} cosePublicKey - COSE encoded public key
 * @return {Buffer}               - RAW PKCS encoded public key
 */
async function convertCOSEPublicKeyToRawPKCSECDHAKey(cosePublicKey) {
  /* 
  +------+-------+-------+---------+----------------------------------+
  | name | key   | label | type    | description                      |
  |      | type  |       |         |                                  |
  +------+-------+-------+---------+----------------------------------+
  | crv  | 2     | -1    | int /   | EC Curve identifier - Taken from |
  |      |       |       | tstr    | the COSE Curves registry         |
  |      |       |       |         |                                  |
  | x    | 2     | -2    | bstr    | X Coordinate                     |
  |      |       |       |         |                                  |
  | y    | 2     | -3    | bstr /  | Y Coordinate                     |
  |      |       |       | bool    |                                  |
  |      |       |       |         |                                  |
  | d    | 2     | -4    | bstr    | Private key                      |
  +------+-------+-------+---------+----------------------------------+
  */

  const coseStruct = await decodeFirst(cosePublicKey);
  const tag = Buffer.from([0x04]);
  const x = coseStruct.get(-2);
  const y = coseStruct.get(-3);

  return Buffer.concat([tag, x, y]);
}

function getX509CertificateInfo(certificate) {
  const x = new X509();
  x.readCertPEM(certificate);
  const subjectString = x.getSubjectString();
  const subjectParts = subjectString.slice(1).split("/");
  const subject = {};
  for (const field of subjectParts) {
    const kv = field.split("=");
    subject[kv[0]] = kv[1];
  }
  const basicConstraints = x.getExtBasicConstraints();
  return {
    basicConstraints: basicConstraints || {},
    subject,
    version: x.version,
  };
}

/**
 * Takes signature, data and PEM public key and tries to verify signature
 */
function verifySignature(signature, data, publicKey) {
  return createVerify(HASH_ALGO).update(data).verify(publicKey, signature);
}

/**
 * Generates random base64 string; default length is 32
 */
function randomBase64(len = 32) {
  const buff = randomBytes(len);
  return buff.toString("base64");
}

module.exports = {
  HASH_ALGO,
  hash,
  convertASN1toPEM,
  convertCOSEPublicKeyToObject,
  convertCOSEPublicKeyToRawPKCSECDHAKey,
  getX509CertificateInfo,
  verifySignature,
  randomBase64,
};
