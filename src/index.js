"use strict";
const config = require("config");
const debug = require("util").debug(`${process.env.SERVER_NAME}:server`);
const http = require("http");

const { port } = config.get("server");
const app = require("./app");
const log = {
  debug,
  error: console.error,
};
const mongo = require("./repositories/mongoose");

const server = http.createServer(app);
server.listen(port, () => {
  debug(`Listening on port: ${port}`);
});
server.on("error", (error) => {
  log.error(error);
});

process.on("unhandledRejection", (reason, promise) => {
  log.error("Unhandled Rejection at:", promise, "reason:", reason);
});
