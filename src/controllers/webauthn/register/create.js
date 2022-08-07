const config = require("config");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:webauthn:register:create`
);

const Identity = require("../../../repositories/models/identity");

module.exports = async function create(req, res, next) {
  debug(`Start`);
  try {
    const identity = await Identity.CreateIdentity(req.body);
    res.json(await identity.createCredentialsJSON());
  } catch (error) {
    next(createError(500, error));
  }
};
