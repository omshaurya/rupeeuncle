/**
 * Wraps an async Express route handler so thrown errors / rejected promises
 * are passed to next(err) automatically instead of crashing the process.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
