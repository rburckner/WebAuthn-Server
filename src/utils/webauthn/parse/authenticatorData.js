const { flagsObj } = require("./flags");

const BYTE_MAP = {
  // in bytes
  rpIdHash: {
    start: () => 0,
    length: 32,
    end: () => BYTE_MAP.rpIdHash.start() + BYTE_MAP.rpIdHash.length,
  },
  flags: {
    start: () => BYTE_MAP.rpIdHash.end(),
    length: 1,
    end: () => BYTE_MAP.flags.start() + BYTE_MAP.flags.length,
  },
  counter: {
    start: () => BYTE_MAP.flags.end(),
    length: 4,
    end: () => BYTE_MAP.counter.start() + BYTE_MAP.counter.length,
  },
  aaguid: {
    start: () => BYTE_MAP.counter.end(),
    length: 16,
    end: () => BYTE_MAP.aaguid.start() + BYTE_MAP.aaguid.length,
  },
  L: {
    start: () => BYTE_MAP.aaguid.end(),
    length: 2,
    end: () => BYTE_MAP.L.start() + BYTE_MAP.L.length,
  },
  credentialId: {
    start: () => BYTE_MAP.L.end(),
    length: (authData) =>
      authData.slice(BYTE_MAP.L.start(), BYTE_MAP.L.end()).readUInt16BE(0),
    end: (authData) =>
      BYTE_MAP.credentialId.start() + BYTE_MAP.credentialId.length(authData),
  },
  COSEPublicKey: {
    start: (authData) => BYTE_MAP.credentialId.end(authData),
  },
};

exports.ParseAuthenticatorData = function ParseAuthenticatorData(authData) {
  const flagsBuf = authData.slice(BYTE_MAP.flags.start(), BYTE_MAP.flags.end());
  const flags = flagsObj(flagsBuf[0]);
  const counterBuf = authData.slice(
    BYTE_MAP.counter.start(),
    BYTE_MAP.counter.end()
  );
  const result = {
    flags: flagsObj(flagsBuf[0]),
    rpIdHash: authData.slice(
      BYTE_MAP.rpIdHash.start(),
      BYTE_MAP.rpIdHash.end()
    ),
    signCount: counterBuf.readUInt32BE(0),
  };
  if (flags.AT) {
    result.aaguid = authData.slice(
      BYTE_MAP.aaguid.start(),
      BYTE_MAP.aaguid.end()
    );
    result.credentialId = authData.slice(
      BYTE_MAP.credentialId.start(),
      BYTE_MAP.credentialId.end(authData)
    );
    result.COSEPublicKey = authData.slice(
      BYTE_MAP.COSEPublicKey.start(authData)
    );
  }

  return result;
};
