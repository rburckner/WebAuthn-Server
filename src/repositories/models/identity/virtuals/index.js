"use strict";
module.exports = (schema) => {
  schema.virtual("displayName").get(function () {
    return "todo - displayName";
  });

  schema.virtual("excludeCredentials").get(function () {
    if (!this.webauthn.credentials) {
      return undefined;
    }
    return this.webauthn.credentials.map((credential) => {
      return { id: credential.id, type: credential.type };
    });
  });

  schema.virtual("name").get(function () {
    return "todo - name";
  });

  schema.virtual("user").get(function () {
    return {
      id: this.id,
      displayName: this.displayName,
      name: this.name,
    };
  });
};
