import { Options } from "swagger-jsdoc";

const options: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "yangChi API",
      version: "1.0.0",
      description: "This is docs",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/controller/*.js"],
};

export default options;
