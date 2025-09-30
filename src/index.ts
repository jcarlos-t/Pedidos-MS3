import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import pedidoRoutes from './routes/pedidoRoutes';
import historialRoutes from './routes/historialRoutes';  // Importar las rutas de historial
import { errorMiddleware } from './middleware/error';
import { requestLogger, errorLogger } from './middleware/logger';  // Importar middleware de logging
import swaggerDocs from './swagger';  // Importar la configuración de Swagger

dotenv.config();

// Configurar el servidor
const app = express();
const port = process.env.PORT || 3003;  // Puerto para el servidor
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ms3';  // URL de la base de datos MongoDB
const corsOrigin = process.env.CORS_ORIGIN || '*';  // URL permitida para CORS

// Configurar CORS
app.use(cors({ origin: corsOrigin }));

// Configuración para recibir JSON en las solicitudes
app.use(express.json());

// Middleware de logging
app.use(requestLogger);

// Conectar a MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir si la conexión falla
  });


// Endpoint de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend funcionando',
    timestamp: new Date().toISOString()
  });
});

// Usar las rutas de Pedidos
app.use('/', pedidoRoutes);

// Usar las rutas de Historial
app.use('/', historialRoutes);

// Usar el middleware de logging de errores
app.use(errorLogger);

// Usar el middleware de manejo de errores
app.use(errorMiddleware);

// Llamar a la función swaggerDocs para integrar Swagger
swaggerDocs(app);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

