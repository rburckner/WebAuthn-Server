const createError = require("http-errors");
const debug = require("util").debug(
  `${process.env.SERVER_NAME}:controllers:errors`
);

exports.RouterErrorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  if (!error.status) {
    error.status = 500;
  }
  switch (true) {
    case 400 <= error.status < 500:
      res.status(error.status).json({
        message: error.message,
      });
      break;
    default:
      res.status(error.status).json({
        message:
          process.env.NODE_ENV !== "production" ? error.message || error : {},
      });
  }
};

exports.RouteNotFound = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    debug(`Route Not Found: ${req.url}`);
  }
  next(createError(404));
};
