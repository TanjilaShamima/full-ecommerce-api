// filepath: middlewares/role.js
const createError = require("http-errors");

/**
 * Middleware for role-based access control
 * @param {array<string>} allowedRoles - Roles allowed to access the route
 */
const permitRole = (allowedRoles = []) => {
  return (req, res, next) => {
    // req.user should be set by isLoggedIn middleware
    const user = req.user;
    if (!user || !user.role) {
      return next(createError(401, "User role not found or not authenticated"));
    }
    if (!allowedRoles.includes(user.role)) {
      return next(createError(403, "You do not have access to this resource"));
    }
    next();
  };
};

module.exports = permitRole;
