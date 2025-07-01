const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");

const privateKeyPath = process.env.JWT_ACCESS_PRIVATE_KEY
  ? path.resolve(process.env.JWT_ACCESS_PRIVATE_KEY)
  : "";
const publicKeyPath = process.env.JWT_ACCESS_PUBLIC_KEY
  ? path.resolve(process.env.JWT_ACCESS_PUBLIC_KEY)
  : "";

const appConfig = {
  name: process.env.API_NAME || "API",
  version: process.env.API_VERSION || "1.0.0",
  port: process.env.APP_PORT || 8000,
  appDomain: process.env.APP_URL || "http://localhost:8000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  environment: process.env.NODE_ENV || "development",
  db: {
    mongoDbUrl: process.env.MONGODB_URL || "",
    dbName: process.env.DB_NAME || "mydatabase",
    dbUser: process.env.DB_USER || "",
    dbPassword: process.env.DB_PASSWORD || "",
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: process.env.DB_PORT || 5432,
  },
  email: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    userName: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/api/v1/auth/google/callback", // This should match the route in your authRoute
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    callbackURL: "/api/v1/auth/facebook/callback", // This should match the route in your authRouter
  },
  jwt: {
    jwtActivationKey: process.env.JWT_ACTIVATION_KEY,
    jwtAccessKey: process.env.JWT_ACCESS_KEY,
    jwtPasswordResetKey: process.env.JWT_RESET_PASSWORD_KEY,
    jwtRefreshKey: process.env.JWT_REFRESH_KEY,
    accessKey: {
      privateKey: privateKeyPath ? fs.readFileSync(privateKeyPath, "utf8") : "",
      publicKey: publicKeyPath ? fs.readFileSync(publicKeyPath, "utf8") : "",
    },
  },
  regex: {
    emailRegex: /^[\w-\.]+(\+\d+)?@([\w-]+\.)+[\w-]{2,4}$/,
    passwordRegex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    usernameRegex: /^[a-zA-Z0-9_]{3,10}$/,
  },
  imageFolders: ["og", "lg", "md", "sm"],
  imageSizes: {
    og: null, // this is original size
    lg: { width: 800, height: 600 },
    md: { width: 600, height: 400 },
    sm: { width: 300, height: 200 },
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME
  }
};

module.exports = appConfig;
