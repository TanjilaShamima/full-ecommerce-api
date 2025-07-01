/**
 * @file s3.js
 * @description This file contains the configuration for AWS S3 storage.
 */

const AWS = require("aws-sdk");
const appConfig = require("./constant");


const s3 = new AWS.S3({
  accessKeyId: appConfig.s3.accessKeyId,
  secretAccessKey: appConfig.s3.secretAccessKey,
  region: appConfig.s3.region,
});

module.exports = s3;