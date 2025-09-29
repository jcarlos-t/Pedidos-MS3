import mongoose, { Schema, Document } from 'mongoose';

// Esquema principal de HistorialPedido
const HistorialPedidoSchema = new Schema({
  id_pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true }, // Referencia al ID del pedido
  id_usuario: { type: Number, required: true }, // ID del usuario (referencial, no es referencia externa)
  fecha_evento: { type: Date, default: Date.now }, // Fecha de entrega o la fecha relevante del evento
  estado: { type: String, enum: ['pendiente', 'entregado', 'cancelado'], required: true }, // El estado del pedido en ese momento
  comentarios: { type: String, required: false }, // Comentarios o notas sobre el estado o la situación del pedido
});

// Crear el modelo de HistorialPedido
const HistorialPedido = mongoose.model<HistorialPedidoDocument>('HistorialPedido', HistorialPedidoSchema);

// Definir la interfaz para el documento de HistorialPedido
export interface HistorialPedidoDocument extends Document {
  _id: mongoose.Types.ObjectId; // ID único del historial de cambios, generado por MongoDB
  id_pedido: mongoose.Types.ObjectId; // Referencia al ID del pedido (relación con la colección de Pedidos)
  id_usuario: number; // ID del usuario (referencial, no es referencia externa)
  fecha_evento: Date; // Fecha de entrega, si aplica (o la fecha relevante del evento)
  estado: 'pendiente' | 'entregado' | 'cancelado'; // El estado del pedido en ese momento
  comentarios?: string; // Comentarios o notas sobre el estado o la situación del pedido
}

export default HistorialPedido;

