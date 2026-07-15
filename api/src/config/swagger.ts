import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lead Distribution API",
      version: "1.0.0",
      description:
        "API for client deliveries and lead routing",
    },
    servers: [
      {
        url: "/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path
      .join(__dirname, "../routes/*.{ts,js}")
      .split(path.sep)
      .join("/"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (
  app: Express
) => {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};
