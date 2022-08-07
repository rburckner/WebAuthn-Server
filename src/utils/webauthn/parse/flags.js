"use strict";

function flagsObj(flagsInt) {
  return {
    UP: !!(flagsInt & 0x01),
    UV: !!(flagsInt & 0x04),
    AT: !!(flagsInt & 0x40),
    ED: !!(flagsInt & 0x80),
    flagsInt,
  };
}

module.exports = { flagsObj };
