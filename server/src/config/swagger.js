const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ecommerce 3D API",
      version: "1.0.0",
      description: "API du projet Ecommerce 3D",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/**/*.js"],
};

module.exports = swaggerJsdoc(options);