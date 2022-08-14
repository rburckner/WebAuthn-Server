const { flagsObj } = require("./flags");

exports.ParseAuthenticatorData = function ParseAuthenticatorData(authData) {
  const rpIdHash = authData.slice(0, 32);
  authData = authData.slice(32);
  const flagsBuf = authData.slice(0, 1);
  authData = authData.slice(1);
  const flags = flagsObj(flagsBuf[0]);
  const counterBuf = authData.slice(0, 4);
  authData = authData.slice(4);
  const signCount = counterBuf.readUInt32BE(0);

  const result = {
    counterBuf,
    flags,
    flagsBuf,
    rpIdHash,
    signCount,
  };

  if (flags.AT) {
    result.aaguid = authData.slice(0, 16);
    authData = authData.slice(16);
    const credentialIdLengthBuffer = authData.slice(0, 2);
    authData = authData.slice(2);
    const credentialIdLength = credentialIdLengthBuffer.readUInt16BE(0);
    result.credentialId = authData.slice(0, credentialIdLength);
    authData = authData.slice(credentialIdLength);
    result.COSEPublicKey = authData;
  }

  return result;
};
