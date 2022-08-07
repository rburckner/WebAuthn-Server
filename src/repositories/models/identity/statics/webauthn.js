const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:models:identities:statics:webauthn`
);

exports.UniqueCredentialId = async function UniqueCredentialId(credential) {
  const { credentialId } =
    credential.response.attestationObject.authData.credentialData;
  debug(`Searching for credential id: ${credentialId}`);
  const identities = await this.find().select("webauthn");
  const credenitalIds = identities
    .map((identity) => identity.webauthn.credentials)
    .flat()
    .map((credential) => credential.id)
    .filter((id) => id);

  return !credenitalIds.includes(credentialId);
};
