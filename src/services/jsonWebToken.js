/**
 * @file jsonWebToken.js
 * @description This file contains functions for generating and verifying JSON Web Tokens (JWT).
 */

const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const createJsonWebToken = (payload, privateKey, expiresIn = "1h") => {
  if (typeof payload !== "object" || !payload) {
    throw createError(400, "Payload must be a non empty object");
  }

  if (typeof privateKey !== "string" || !privateKey) {
    throw createError(400, "Private key must be a non empty string");
  }
  try {
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: expiresIn,
    });
    if (!token) {
      throw createError(500, "Token generation failed");
    }
    return token;
  } catch (error) {
    throw createError(
      error.status || 500,
      error.message || "Failed to sign the JWT"
    );
  }
};

const verifyJsonWebToken = (token, publicKey) => {
  if (typeof token !== "string" || !token) {
    throw createError(400, "Invalid token");
  }

  if (typeof publicKey !== "string" || !publicKey) {
    throw createError(400, "Public key must be a non empty string");
  }

  try {
    const decoded = jwt.verify(token, publicKey, {algorithms: ["RS256"]});
    if (!decoded) {
      throw createError(401, "Token verification failed");
    }
    return decoded;
  } catch (error) {
    throw createError(401, "Invalid or expired token");
  }
};

module.exports = {
  createJsonWebToken,
  verifyJsonWebToken,
};
