const FLAG_POS_HEX = {
  UP: 0x01,
  UV: 0x04,
  AT: 0x40,
  ED: 0x80,
};

function hasAttestation(flagsInt) {
  return (flagsInt & FLAG_POS_HEX.AT) === 64;
}

function hasExtensions(flagsInt) {
  return (flagsInt & FLAG_POS_HEX.ED) === 128;
}

function userPresent(flagsInt) {
  return (flagsInt & FLAG_POS_HEX.UP) === 1;
}

function userVerified(flagsInt) {
  return (flagsInt & FLAG_POS_HEX.UV) === 4;
}

function flagsObj(flagsInt) {
  return {
    AT: hasAttestation(flagsInt),
    ED: hasExtensions(flagsInt),
    UP: userPresent(flagsInt),
    UV: userVerified(flagsInt),
  };
}

module.exports = { flagsObj };
