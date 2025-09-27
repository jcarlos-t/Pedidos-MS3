import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Configuración de CORS
app.use(cors());

// Configuración para recibir JSON
app.use(express.json());

// Conectar a MongoDB (sin las opciones obsoletas)
mongoose.connect('mongodb://localhost:27017/gestionPedidos')
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Servidor de Gestión de Pedidos está corriendo!');
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

