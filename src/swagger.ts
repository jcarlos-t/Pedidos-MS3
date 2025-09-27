// src/swagger.ts
import { Express } from 'express';  // Importar la interfaz Express si es necesario

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Definir las opciones de Swagger
const options = {
  definition: {
    openapi: "3.0.0", // Usamos la especificación OpenAPI 3
    info: {
      title: "API de Gestión de Pedidos",
      version: "1.0.0",
      description: "Documentación de la API para gestionar pedidos, usuarios y productos",
      contact: {
        name: "Dev1",
        email: "dev1@cloud.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3003", // Cambia esto según tu entorno
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Rutas donde Swagger buscará comentarios para documentar
};

// Crear la especificación Swagger
const swaggerSpec = swaggerJSDoc(options);

// Función para usar Swagger en Express
const swaggerDocs = (app: Express) => {
  // Usar swagger-ui-express para servir la documentación
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;  // Asegúrate de exportarlo correctamente

