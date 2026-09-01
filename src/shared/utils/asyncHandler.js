/**
 * Wraps an async function and automatically catches any errors, passing them to next()
 * This removes the need for try-catch blocks in every controller.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;

