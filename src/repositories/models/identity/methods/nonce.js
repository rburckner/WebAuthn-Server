const config = require("config");
const createError = require("http-errors");
const crypto = require("crypto");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:methods:nonce`
);

const { length, validityPeriod } = config.get("nonce");

function expiredNonceEntry(entry) {
  if (!entry) {
    return true;
  }
  const { expiresOn } = entry;
  return expiresOn < Date.now();
}

exports.generateNonce = async function generateNonce() {
  debug(`Generating for userId:${this.id}`);
  const nonce = crypto.randomBytes(parseInt(length / 2)).toString("hex");
  const expiresOn = Date.now() + parseInt(validityPeriod);
  this.nonces.push({ nonce, expiresOn });
  await this.save();
  debug(`Returning ${nonce}`);
  return nonce;
};

exports.removeNonce = async function removeNonce(nonce) {
  debug(`Removing ${nonce} from userId:${this.id}`);
  this.nonces = this.nonces.filter((entry) => entry.nonce !== nonce);
  await this.save();
};

exports.validNonce = async function validNonce(nonce) {
  debug(`Validating ${nonce} from userId:${this.id}`);
  const valid = expiredNonceEntry(
    this.nonces.filter((entry) => entry.nonce === nonce)[0]
  );
  debug(`Nonce ${nonce} ${valid ? "is" : "is NOT"} valid`);
  return valid;
};
