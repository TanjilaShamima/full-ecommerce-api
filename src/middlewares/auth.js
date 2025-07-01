/**
 * @file auth.js
 * @description Middleware for authentication and authorization.
 */
const createError = require("http-errors");
const { verifyJsonWebToken } = require("../services/jsonWebToken");
const appConfig = require("../config/constant");

const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "Authorization header is missing or invalid"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createError(401, "Access Token is missing"));
  }

  // Verify the token (this is just a placeholder, implement your own logic)
  try {
    const decoded = verifyJsonWebToken(token, appConfig.jwt.accessKey.publicKey);
    if (!decoded || !decoded.userId) {
      return next(createError(401, "Invalid or expired token"));
    }
    req.user = decoded.user || decoded;
    next();
  } catch (error) {
    return next(createError(error));
  }
};

module.exports = {
    isLoggedIn,
}