import mongoose, { Schema, Document } from 'mongoose';

// Esquema para los productos dentro de un pedido
const ProductoSchema = new Schema({
  id_producto: { type: Number, required: true }, // ID del producto (referencia a la tabla de Productos)
  cantidad: { type: Number, required: true },
  precio_unitario: { type: Number, required: true }, // DECIMAL(10, 2) como Number
});

// Esquema principal de Pedido
const PedidoSchema = new Schema({
  id_usuario: { type: Number, required: true }, // ID del usuario (referencia a la tabla de Usuarios)
  fecha_pedido: { type: Date, default: Date.now }, // ISODate
  estado: { type: String, enum: ['pendiente', 'entregado', 'cancelado'], required: true },
  total: { type: Number, required: true }, // DECIMAL(10, 2) como Number
  productos: [ProductoSchema], // Array de productos
});

// Crear el modelo de Pedido
const Pedido = mongoose.model<PedidoDocument>('Pedido', PedidoSchema);

// Definir la interfaz para el documento de Pedido
export interface PedidoDocument extends Document {
  _id: mongoose.Types.ObjectId; // ID único del pedido, generado por MongoDB
  id_usuario: number; // ID del usuario que hizo el pedido (referencia a la tabla de Usuarios)
  fecha_pedido: Date; // Fecha en que se realizó el pedido
  estado: 'pendiente' | 'entregado' | 'cancelado'; // Estado del pedido
  total: number; // Total del pedido (suma de los productos y otros cargos)
  productos: {
    id_producto: number; // ID del producto (referencia a la tabla de Productos)
    cantidad: number; // Cantidad del producto en el pedido
    precio_unitario: number; // Precio por unidad del producto
  }[];
}

export default Pedido;

