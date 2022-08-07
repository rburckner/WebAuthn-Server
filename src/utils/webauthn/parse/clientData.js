function ParseClientDataFromBuffer(buffer) {
  return JSON.parse(buffer.toString());
}

exports.ParseClientDataFromJSON = function ParseClientDataFromJSON(
  clientDataJSON
) {
  const buffer = Buffer.from(clientDataJSON, "base64");
  const clientData = ParseClientDataFromBuffer(buffer);
  const challenge = Buffer.from(clientData.challenge, "base64").toString(
    "base64"
  );
  return { ...clientData, challenge };
};
