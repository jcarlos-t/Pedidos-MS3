// src/models/HistorialPedido.ts
import mongoose, { Schema, Document } from 'mongoose';

// Esquema principal de HistorialPedido
const HistorialPedidoSchema = new Schema({
  id_pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  fecha_entrega: { type: Date, required: true },
  estado: { type: String, enum: ['pendiente', 'entregado', 'cancelado'], required: true },
  comentarios: { type: String, required: false },
});

// Crear el modelo de HistorialPedido
const HistorialPedido = mongoose.model<HistorialPedidoDocument>('HistorialPedido', HistorialPedidoSchema);

// Definir la interfaz para el documento de HistorialPedido
export interface HistorialPedidoDocument extends Document {
  id_pedido: mongoose.Types.ObjectId;
  fecha_entrega: Date;
  estado: 'pendiente' | 'entregado' | 'cancelado';
  comentarios?: string;
}

export default HistorialPedido;

