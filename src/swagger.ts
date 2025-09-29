// src/swagger.ts
import { Express } from 'express';  // Importar la interfaz Express si es necesario

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Definir las opciones de Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Pedidos",
      version: "1.0.0",
      description: "Documentación de la API para gestionar pedidos, usuarios y productos",
      contact: { name: "Dev1", email: "dev1@cloud.com" },
    },
    servers: [{ url: "http://localhost:3003" }],
    components: {
      schemas: {
        ProductoEnPedido: {
          type: "object",
          required: ["id_producto", "cantidad", "precio_unitario"],
          properties: {
            id_producto: { type: "integer", example: 101 },
            cantidad: { type: "integer", example: 2 },
            precio_unitario: { type: "number", example: 19.99 },
          },
        },
        Pedido: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65200e3f9d4f2b5b5df8a111" },
            id_usuario: { type: "integer", example: 14 },
            fecha_pedido: { type: "string", format: "date-time" },
            estado: { type: "string", enum: ["pendiente", "entregado", "cancelado"], example: "pendiente" },
            total: { type: "number", example: 59.97 },
            productos: { type: "array", items: { $ref: "#/components/schemas/ProductoEnPedido" } },
          },
        },
        HistorialPedido: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65200e6a9d4f2b5b5df8a222" },
            id_pedido: { type: "string", example: "65200e3f9d4f2b5b5df8a111" },
            id_usuario: { type: "integer", example: 14 },
            fecha_evento: { type: "string", format: "date-time" },
            estado: { type: "string", enum: ["pendiente", "entregado", "cancelado"], example: "entregado" },
            comentarios: { type: "string", example: "Pedido entregado al cliente" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string", example: "Estado inválido. Debe ser: pendiente, entregado o cancelado" },
          },
        },
        MensajeRespuesta: {
          type: "object",
          properties: {
            mensaje: { type: "string", example: "Operación realizada exitosamente" },
          },
        },
      },
    },
  },
  // Incluye TS y JS para que funcione tanto con ts-node como con build a dist
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};


// Crear la especificación Swagger
const swaggerSpec = swaggerJSDoc(options);

// Función para usar Swagger en Express
const swaggerDocs = (app: Express) => {
  // Usar swagger-ui-express para servir la documentación
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;  // Asegúrate de exportarlo correctamente

