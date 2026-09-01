const ApiError = require('../shared/utils/ApiError');
const config = require('../config/env');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors })
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;

