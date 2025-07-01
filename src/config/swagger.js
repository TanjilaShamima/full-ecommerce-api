/* * Swagger configuration for this application.
 * @fileoverview This file sets up Swagger for API documentation.
 * @requires swagger-jsdoc
 * @requires ./constant
 */

const swaggerJSDoc = require("swagger-jsdoc");
const appConfig = require("./constant");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cosmos Practice App",
      version: "1.0.0",
      description: "API documentation for the Cosmos Practice App",
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port || 8000}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT Bearer token **_only_**",
        },
        appSecret: {
          type: "apiKey",
          in: "header",
          name: "x-app-secret",
          description: "Your custom app secret header",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
          },
        },
      },
    },
  },
  apis: [
    './src/routers/*.js', // Correct path to your routers
  ],
};

const swaggerDocs = swaggerJSDoc(options);

module.exports = swaggerDocs;
