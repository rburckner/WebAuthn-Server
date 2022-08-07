"use strict";
const config = require("config");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:repositories:mognoose`
);
const mongoose = require("mongoose");

const log = {
  debug,
  error: console.error,
};

const { dbName, host, opts, port, uri } = config.get("repositories.mongoose");
const _uri = uri || `mongodb://${host}:${port}/${dbName}`;
mongoose.connection
  .on("open", () => log.debug("MongoDB connection: open"))
  .on("close", () => log.debug("MongoDB connection: close"))
  .on("connecting", () => log.debug("MongoDB connecting to: ", _uri))
  .on("disconnected", () => log.debug("MongoDB connection: disconnecting"))
  .on("disconnected", () => log.debug("MongoDB connection: disconnected"))
  .on("reconnected", () => log.debug("MongoDB connection: reconnected"))
  .on("fullsetup", () => log.debug("MongoDB connection: fullsetup"))
  .on("all", () => log.debug("MongoDB connection: all"))
  .on("error", (error) => log.error("MongoDB connection: error:", error));

mongoose.connect(_uri, opts);

return mongoose.connection;
