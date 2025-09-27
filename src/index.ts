import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import pedidoRoutes from './routes/pedidoRoutes';
import { errorMiddleware } from './middleware/error';

// Cargar las variables de entorno desde el archivo .env
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

// Conectar a MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir si la conexión falla
  });

// Usar las rutas de Pedidos
app.use('/api', pedidoRoutes);

// Usar el middleware de manejo de errores
app.use(errorMiddleware);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

