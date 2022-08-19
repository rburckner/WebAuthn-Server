const config = require("config");
const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:common`
);

const { verify } = require("../../utils/jwt");
const Identity = require("../../repositories/models/identity");

exports.validateAccessToken = async function validateAccessToken(
  req,
  res,
  next
) {
  const accessToken = req.headers["authorization"].split(" ")[1];
  if (!accessToken) {
    return next(
      createError(
        401,
        `A token is required in 'authorization' header for authentication`
      )
    );
  }
  debug(`Validating token`);
  let userId = "";
  try {
    const { sub } = await verify(accessToken);
    userId = sub;
  } catch (error) {
    next(createError(500, error));
  }
  debug(`Valid token`);
  try {
    res.locals.identity = await Identity.findById(userId);

    next();
  } catch (error) {
    next(createError(500, error));
  }
};
