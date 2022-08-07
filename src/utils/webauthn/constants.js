const HASH_ALGO = "sha256";

const SUPPORTED_CREDENTIAL_TYPES = ["public-key"];

/**
 * U2F Presence constant
 */
const U2F_USER_PRESENTED = 0x01;

module.exports = {
  HASH_ALGO,
  SUPPORTED_CREDENTIAL_TYPES,
  U2F_USER_PRESENTED,
};
