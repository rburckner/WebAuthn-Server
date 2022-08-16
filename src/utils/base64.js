exports.ArrayBufferToBase64url = function ArrayBufferToBase64url(arrayBuffer) {
  if (typeof arrayBuffer === "undefined") {
    return undefined;
  }
  return Buffer.from(arrayBuffer).toString("base64url");
};

exports.ArrayBufferToBase64 = function ArrayBufferToBase64(arrayBuffer) {
  if (typeof arrayBuffer === "undefined") {
    return undefined;
  }
  return Buffer.from(arrayBuffer).toString("base64");
};

exports.Base64urlToArrayBuffer = function ArrayBufferToBase64(base64url) {
  if (typeof base64url === "undefined") {
    return undefined;
  }
  return Buffer.from(base64url, "base64url");
};

exports.Base64ToArrayBuffer = function Base64ToArrayBuffer(base64) {
  if (typeof base64 === "undefined") {
    return undefined;
  }
  return Buffer.from(base64, "base64url");
};

exports.Base64ToObject = function Base64ToObject(base64) {
  if (typeof base64 === "undefined") {
    return undefined;
  }
  return JSON.parse(Buffer.from(base64, "base64").toString());
};

exports.Base64urlToObject = function Base64urlToObject(base64url) {
  if (typeof base64url === "undefined") {
    return undefined;
  }
  return JSON.parse(Buffer.from(base64url, "base64url").toString());
};
