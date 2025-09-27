import mongoose, { Schema, Document } from 'mongoose';

// Esquema para los productos dentro de un pedido
const ProductoSchema = new Schema({
  id_producto: { type: Number, required: true }, // ID del producto (sin referencia externa)
  cantidad: { type: Number, required: true },
  precio_unitario: { type: mongoose.Types.Decimal128, required: true },
});

// Esquema principal de Pedido
const PedidoSchema = new Schema({
  id_usuario: { type: Number, required: true }, // ID del usuario (sin referencia externa)
  fecha_pedido: { type: Date, default: Date.now },
  estado: { type: String, enum: ['pendiente', 'entregado', 'cancelado'], required: true },
  total: { type: mongoose.Types.Decimal128, required: true },
  productos: [ProductoSchema], // Array de productos
});

// Crear el modelo de Pedido
const Pedido = mongoose.model<PedidoDocument>('Pedido', PedidoSchema);

// Definir la interfaz para el documento de Pedido
export interface PedidoDocument extends Document {
  id_usuario: number; // ID de usuario como número (no referencia)
  fecha_pedido: Date;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  total: mongoose.Types.Decimal128;
  productos: {
    id_producto: number; // ID de producto como número (no referencia)
    cantidad: number;
    precio_unitario: mongoose.Types.Decimal128;
  }[];
}

export default Pedido;

