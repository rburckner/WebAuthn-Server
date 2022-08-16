const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:common`
);

const Identity = require("../../repositories/models/identity");

exports.decorateLocalObject = function decorateLocalObject(req, res, next) {
  res.locals = res.locals || {};
  next();
};

exports.decorateIdentityFromBody = async function decorateIdentityFromBody(
  req,
  res,
  next
) {
  const { userId } = req.body;
  try {
    if (userId) {
      debug(`Decorated identity object for userId: ${userId}`);
      res.locals.identity = await Identity.findById(userId);
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.decorateRemoteAddress = function decorateRemoteAddress(req, res, next) {
  res.locals.remoteAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  debug(`Set local.remoteAddress to ${res.locals.remoteAddress}`);
  next();
};
