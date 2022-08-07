"use strict";
const config = require("config");
const createError = require("http-errors");

const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:common`
);

const Identity = require("../../repositories/models/identity");

exports.decorateLocalObject = function decorateLocalObject(req, res, next) {
  res.locals = res.locals || {};
  next();
};

exports.decorateDisplayName = function decorateDisplayName(req, res, next) {
  const displayName =
    req.body.displayName || req.body.username || req.body.name;
  if (!displayName) {
    next(
      createError(
        400,
        `Request body 'displayname', 'username', or 'name' paramater required`
      )
    );
  }
  res.locals.displayName = displayName;
  next();
};

exports.decorateIdentity = async function decorateIdentity(req, res, next) {
  const { displayName } = res.locals;
  try {
    res.locals.identity = await Identity.findOne({ displayName });
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
