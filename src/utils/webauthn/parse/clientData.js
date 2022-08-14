function ParseClientDataFromBuffer(buffer) {
  return JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buffer)));
}

exports.ParseClientDataFromJSON = function ParseClientDataFromJSON(
  clientDataJSON
) {
  const buffer = Buffer.from(clientDataJSON, "base64url");
  return ParseClientDataFromBuffer(buffer);
};
