"use strict";
const config = require("config");
const createError = require("http-errors");
const { randomBase64 } = require("../../../../utils/crypto");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:methods:webauthn`
);

const {
  ChallengeByteLength,
  PublicKeyCredentialCreationOptions,
  PublicKeyCredentialRequestOptions,
  Timeouts,
} = config.get("webauthn");

exports.addCredential = function addCredential({ id, response, type }) {
  debug(`addCredential`);
  const { publicKey, transports } = response;
  const { signCount } = response.attestationObject.authData;
  this.webauthn.credentials.push({
    id,
    publicKey,
    signCount,
    type,
    transports,
  });
  return this.save();
};

exports.createCredentialsJSON = async function createCredentialsJSON() {
  debug(`Creating credentials JSON for userId ${this._id}`);
  const { userVerification } =
    PublicKeyCredentialCreationOptions.authenticatorSelection;
  const opts = {
    ...PublicKeyCredentialCreationOptions,
    challenge: randomBase64(
      ChallengeByteLength > 16 ? ChallengeByteLength : 16
    ),
    excludeCredentials: this.excludeCredentials,
    timeout:
      userVerification === "discouraged"
        ? Timeouts.discouraged
        : Timeouts.default,
    user: { id: this.id, name: this.name, displayName: this.displayName },
  };
  const { challenge } = opts;
  debug(`Saving challenge to ${this._id} account`);
  this.webauthn.challenges.push({ challenge });
  try {
    await this.save();
    return opts;
  } catch (error) {
    throw createError(500, error);
  }
};

exports.createLoginChallenge = async function createLoginChallenge() {
  const allowCredentials = this.webauthn.credentials.map((credential) => {
    const { id, transports, type } = credential;
    return { id, transports, type };
  });
  const { userVerification } = PublicKeyCredentialRequestOptions;
  const challenge = randomBase64(
    ChallengeByteLength > 16 ? ChallengeByteLength : 16
  );
  this.webauthn.challenges.push({ challenge });
  await this.save();
  const opts = {
    ...PublicKeyCredentialRequestOptions,
    challenge,
    allowCredentials,
    timeout:
      userVerification === "discouraged"
        ? Timeouts.discouraged
        : Timeouts.default,
  };
  return opts;
};

exports.credential = function credential(id) {
  const identity = this;
  const credential = identity.webauthn.credentials.filter(
    (credential) => credential.id === id
  )[0];
  debug(`Accessing credential ID: ${credential.id}`);
  return {
    setSignCount: function setSignCount(signCount) {
      return identity.updateCredentialSignCount(id, signCount);
    },
    signCountLTET: function signCountLTET(signCount) {
      return identity.signCountLTET(id, signCount);
    },
  };
};

exports.signCountLTET = function signCountLTET(id, signCount) {
  return (
    signCount <=
    this.webauthn.credentials.filter((credential) => credential.id === id)[0]
      .signCount
  );
};

exports.removeChallenge = function removeChallenge({ response }) {
  debug(`removeChallenge - start length ${this.webauthn.challenges.length}`);
  const { challenge } = response.clientData;
  const challengeId = this.webauthn.challenges.filter(
    (element) => (element.challenge = challenge)
  )[0].id;

  this.webauthn.challenges = this.webauthn.challenges.filter(
    (entry) => entry.id !== challengeId
  );
  debug(`removeChallenge - end length ${this.webauthn.challenges.length}`);
  return this.save();
};

exports.updateCredentialSignCount = async function updateCredentialSignCount(
  id,
  signCount
) {
  debug(`updateCredentialSignCount`);
  this.webauthn.credentials.filter(
    (credential) => credential.id === id
  )[0].signCount = signCount;
  await this.save();
};

exports.validChallenge = function validChallenge({ response }) {
  debug(`Validating Challenge`);
  const { challenge } = response.clientData;
  return this.webauthn.challenges
    .map((element) => element.challenge)
    .includes(challenge);
};
