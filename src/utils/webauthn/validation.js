const { convertASN1toPEM, hash } = require("../crypto");
const {
  U2F_USER_PRESENTED,
  HASH_ALGO,
  SUPPORTED_CREDENTIAL_TYPES,
} = require("./constants");
const parse = require("./parse");

function hasKeys(object, keys = []) {
  const testObjKeys = Object.keys(object);
  return keys.every((key) => testObjKeys.includes(key));
}

function isObject(property) {
  return typeof property === "object";
}

function isNumber(property) {
  return typeof property === "number";
}

function isString(property) {
  return typeof property === "string";
}

function validCredential(credential) {
  if (!isObject(credential)) {
    throw new Error(`Invalid credential.`);
  }
  const { id, type } = credential;
  if (!isString(id)) {
    throw new Error(
      `Credential property 'id' must be type 'string'. Received: '${typeof id}'`
    );
  }
  if (!isString(type)) {
    throw new Error(
      `Credential property 'type' must be type 'string'. Received: '${typeof type}'`
    );
  }
  if (!SUPPORTED_CREDENTIAL_TYPES.includes(type)) {
    throw new Error(
      `Only credentials of type [${SUPPORTED_CREDENTIAL_TYPES.join(
        ", "
      )}] supported. Received '${type}'`
    );
  }
}

function validPublicKeyCredential(credential) {
  const KEYS_STR = ["clientDataJSON"];
  const KEYS = [].concat(KEYS_STR);
  try {
    validCredential(credential);
    const { response } = credential;
    if (!isObject(response)) {
      throw new Error(
        `Credential property 'response' must be of type 'object'. Received: ${typeof response}`
      );
    }
    if (!hasKeys(response, KEYS)) {
      throw new Error(
        `Credential response ${
          KEYS.length === 1 ? "property" : "properties"
        } ${KEYS.join(", ")} required.`
      );
    }
    Object.keys(response)
      .filter((key) => KEYS.includes(key))
      .forEach((key) => {
        if (!isString(response[key])) {
          throw new Error(
            `Credential response property '${key}' must be of type 'string'. Received: ${typeof key}`
          );
        }
      });
  } catch (error) {
    throw error;
  }
}

function validAttestation(credential) {
  const KEYS_STR = ["attestationObject"];
  const KEYS = [].concat(KEYS_STR);
  try {
    validPublicKeyCredential(credential);
    const { response } = credential;
    if (!hasKeys(response, KEYS)) {
      throw new Error(
        `Credential response ${
          KEYS.length === 1 ? "property" : "properties"
        } ${KEYS.join(", ")} required.`
      );
    }
    Object.keys(response)
      .filter((key) => KEYS_STR.includes(key))
      .forEach((key) => {
        if (!isString(response[key])) {
          throw new Error(
            `Credential response property '${key}' must be of type 'string'. Received: ${typeof response[
              key
            ]}`
          );
        }
      });
  } catch (error) {
    throw error;
  }
}

function validAssertion(credential) {
  const KEYS_STR = ["authenticatorData", "signature"];
  const KEYS = [].concat(KEYS_STR);
  try {
    validPublicKeyCredential(credential);
    const { response } = credential;
    if (!hasKeys(response, KEYS)) {
      throw new Error(
        `Credential response ${
          KEYS.length === 1 ? "property" : "properties"
        } ${KEYS.join(", ")} required.`
      );
    }
    Object.keys(response)
      .filter((key) => KEYS_STR.includes(key))
      .forEach((key) => {
        if (!isString(response[key])) {
          throw new Error(
            `Credential response property '${key}' must be of type 'string'. Received: ${typeof response[
              key
            ]}`
          );
        }
      });
  } catch (error) {
    throw error;
  }
}

function validFidoU2FKey(
  authenticatorDataBuffer,
  key,
  clientDataJSON,
  base64Signature
) {
  const { rpIdHash, flagsBuf, flags, counterBuf } = parse.AssertionData(
    authenticatorDataBuffer
  );

  if (!(flags & U2F_USER_PRESENTED)) {
    throw new Error("User was NOT presented durring authentication!");
  }

  const clientDataHash = hash(HASH_ALGO, Buffer.from(clientDataJSON, "base64"));
  const signatureBase = Buffer.concat([
    rpIdHash,
    flagsBuf,
    counterBuf,
    clientDataHash,
  ]);

  const publicKey = convertASN1toPEM(Buffer.from(key.publicKey, "base64"));
  const signature = Buffer.from(base64Signature, "base64");

  return verifySignature(signature, signatureBase, publicKey);
}

function validFidoPackedKey(
  authenticatorDataBuffer,
  key,
  clientDataJSON,
  base64Signature
) {
  const { flags } = parse.AuthenticatorData(authenticatorDataBuffer);

  if (!flags.UP) {
    throw new Error("User was NOT presented durring authentication!");
  }
  const clientDataHash = hash(Buffer.from(clientDataJSON, "base64"));
  const signatureBaseBuffer = Buffer.concat([
    authenticatorDataBuffer,
    clientDataHash,
  ]);

  const publicKey = convertASN1toPEM(Buffer.from(key.publicKey, "base64"));
  const signatureBuffer = Buffer.from(base64Signature, "base64");

  return createVerify(HASH_ALGO)
    .update(signatureBaseBuffer)
    .verify(publicKey, signatureBuffer);
}

// TODO: Understand and correctly implement this
// const COSEKEYS = {
//     kty: 1,
//     alg: 3,
//     crv: -1,
//     x: -2,
//     y: -3,
//     n: -1,
//     e: -2,
// };

// const COSEKTY = {
//     OKP: 1,
//     EC2: 2,
//     RSA: 3,
// };

// const COSERSASCHEME = {
//     '-3': 'pss-sha256',
//     '-39': 'pss-sha512',
//     '-38': 'pss-sha384',
//     '-65535': 'pkcs1-sha1',
//     '-257': 'pkcs1-sha256',
//     '-258': 'pkcs1-sha384',
//     '-259': 'pkcs1-sha512',
// };

// const COSECRV = {
//     '1': 'p256',
//     '2': 'p384',
//     '3': 'p521',
// };

// const COSEALGHASH = {
//     '-257': 'sha256',
//     '-258': 'sha384',
//     '-259': 'sha512',
//     '-65535': 'sha1',
//     '-39': 'sha512',
//     '-38': 'sha384',
//     '-260': 'sha256',
//     '-261': 'sha512',
//     '-7': 'sha256',
//     '-36': 'sha384',
//     '-37': 'sha512',
// };
// function verifySurrogateAttestation(
//     authenticatorData: {
//         rpIdHash: any;
//         flagsBuf: any;
//         flags: {
//             up: boolean;
//             uv: boolean;
//             at: boolean;
//             ed: boolean;
//             flagsInt: any;
//         };
//         counter: number;
//         counterBuf: any;
//         aaguid: any;
//         credID: any;
//         COSEPublicKey: any;
//     },
//     signatureBaseBuffer: Buffer,
//     signatureBuffer: any
// ) {
//     const pubKeyCose = decodeAllSync(authenticatorData.COSEPublicKey)[0];
//     const hashAlg = COSEALGHASH[pubKeyCose.get(COSEKEYS.alg)];

//     if (pubKeyCose.get(COSEKEYS.kty) === COSEKTY.EC2) {
//         const x = pubKeyCose.get(COSEKEYS.x);
//         const y = pubKeyCose.get(COSEKEYS.y);
//         const ansiKey = Buffer.from(Buffer.from([0x04]), x, y);
//         const signatureBaseHash = hash(hashAlg, signatureBaseBuffer);
//         const ec = new elliptic.ec(COSECRV[pubKeyCose.get(COSEKEYS.crv)]);
//         const key = ec.keyFromPublic(ansiKey);
//         return key.verify(signatureBaseHash, signatureBuffer);
//     }

//     if (pubKeyCose.get(COSEKEYS.kty) === COSEKTY.RSA) {
//         const signingScheme = COSERSASCHEME[pubKeyCose.get(COSEKEYS.alg)];
//         const key = new NodeRSA(undefined, { signingScheme });
//         key.importKey(
//             {
//                 n: pubKeyCose.get(COSEKEYS.n),
//                 e: 65537,
//             },
//             'components-public'
//         );
//         return key.verify(signatureBaseBuffer, signatureBuffer);
//     }

//     if (pubKeyCose.get(COSEKEYS.kty) === COSEKTY.OKP) {
//         const x = pubKeyCose.get(COSEKEYS.x);
//         const signatureBaseHash = hash(hashAlg, signatureBaseBuffer);
//         const key = new elliptic.eddsa('ed25519');
//         key.keyFromPublic(x);
//         return key.verify(signatureBaseHash, signatureBuffer);
//     }

//     throw new Error('Invalid COSE type!');
// }

module.exports = {
  validAttestation,
  validAssertion,
  validFidoU2FKey,
  validFidoPackedKey,
};
