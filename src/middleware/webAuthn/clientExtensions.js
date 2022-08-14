const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:middleware:webauthn:clientExtensions`
);

exports.validClientExtensions = function validClientExtensions(req, res, next) {
  const { clientExtensionResults } = req.body;
  if (clientExtensionResults) {
    debug(`verify`, JSON.stringify(clientExtensionResults, null, 2));
    //nyi, step 17
  }
  next();
};

exports.evaluateClientExtensions = function evaluateClientExtensions(
  req,
  res,
  next
) {
  const { clientExtensionResults } = req.body;
  if (clientExtensionResults) {
    debug(`evaluate`, JSON.stringify(clientExtensionResults, null, 2));
    //nyi, step 17
  }
  next();
};
