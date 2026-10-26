import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerDefinition } from "./swagger.definition";

export function setupSwagger(app: Express): void {
  const swaggerSpec = swaggerJsdoc({
    definition: swaggerDefinition,
    apis: ["./src/modules/**/*.routes.ts"],
  });

  // Redireciona a raiz para a documentação interativa
  app.get("/", (_req, res) => {
    res.redirect("/api/docs");
  });

  // Interface interativa do Swagger
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Sistema de Service Desk | Swagger",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        docExpansion: "list",
      },
    }),
  );

  // Especificação OpenAPI em JSON
  app.get("/api/openapi.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });
}
