import ApiError from "../utils/ApiError.js";

/**
 * Since this project has NO login/auth system for public users (per spec),
 * the admin panel is protected by a single shared secret key instead of JWT/sessions.
 * The admin frontend sends this key in the "x-admin-key" header on every request.
 *
 * Set ADMIN_API_KEY in your .env file. Keep this key private — anyone with it has
 * full write access to blogs, calculators, ads, and site settings.
 */
export const requireAdminKey = (req, res, next) => {
  const providedKey = req.headers["x-admin-key"];
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey) {
    console.error("ADMIN_API_KEY is not set in environment variables.");
    return next(new ApiError(500, "Admin access is not configured on the server"));
  }

  if (!providedKey || providedKey !== expectedKey) {
    return next(new ApiError(401, "Unauthorized: invalid or missing admin key"));
  }

  next();
};
