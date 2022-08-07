const { decodeFirst } = require("cbor");

const { ParseClientDataFromJSON } = require("./clientData");
const { ParseAuthenticatorData } = require("./authenticatorData");
const { ParsePackedAttestationObject } = require("./fmt/packed");
const { ParseU2FAttestationObject } = require("./fmt/u2f");
const { validAssertion, validAttestation } = require("../validation");

async function ParseAttestationObject(response) {
  const { attestationObject, clientDataJSON } = response;
  const attestationObjectBuffer = Buffer.from(attestationObject, "base64");
  const cborDecodedAttestationObj = await decodeFirst(attestationObjectBuffer);
  switch (cborDecodedAttestationObj.fmt) {
    //https://www.iana.org/assignments/webauthn/webauthn.xhtml
    case "apple":
      throw new Error(`Apple key format not yet implemented`);
    case "android-key":
      throw new Error(`Android key format not yet implemented`);
    case "android-safetynet":
      throw new Error(`Android safetynet format not yet implemented`);
    case "fido-u2f":
      return await ParseU2FAttestationObject(
        cborDecodedAttestationObj,
        clientDataJSON
      );
    case "none":
      return {};
    case "packed":
      return await ParsePackedAttestationObject(
        cborDecodedAttestationObj,
        clientDataJSON
      );
    case "tpm":
      throw new Error(`TPM key format not yet implemented`);
    default:
      return undefined;
  }
}

async function AuthenticationAssertion(credential) {
  try {
    validAssertion(credential);
  } catch (error) {
    throw error;
  }
  const { response } = credential;
  const { authenticatorData, clientDataJSON } = response;
  const clientData = ParseClientDataFromJSON(clientDataJSON);
  const authenticatorDataObject = await ParseAuthenticatorData(
    Buffer.from(authenticatorData, "base64")
  );
  credential.response = {
    ...response,
    clientData,
    authenticatorDataObject,
  };
  return credential;
}

async function RegisterRequest(credential) {
  try {
    validAttestation(credential);
  } catch (error) {
    throw error;
  }
  const { response } = credential;
  const { clientDataJSON } = response;
  const clientData = ParseClientDataFromJSON(clientDataJSON);
  const attestationObject = await ParseAttestationObject(response);
  credential.response = {
    ...response,
    clientData,
    attestationObject,
  };
  return credential;
}

module.exports = {
  AuthenticationAssertion,
  RegisterRequest,
};
