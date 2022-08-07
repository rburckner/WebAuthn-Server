"use strict";
module.exports = (schema) => {
  schema.virtual("username").get(function () {
    return this.displayName;
  });

  schema.virtual("username").set(function (username) {
    this.displayName = username;
  });

  schema.virtual("excludeCredentials").get(function () {
    if (!this.webauthn.credentials) {
      return null;
    }
    return this.webauthn.credentials.map((credential) => {
      return { id: credential.id, type: credential.type };
    });
  });
};
