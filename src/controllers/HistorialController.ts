import { Request, Response } from 'express';
import HistorialPedido from '../models/HistorialPedido';
import Pedido from '../models/Pedido';

class HistorialController {

  // Obtener historial de pedidos de un usuario (con filtros opcionales de estado)
  static async obtenerHistorialDeUsuario(req: Request, res: Response) {
    try {
      const { id_usuario } = req.params;
      const { estado } = req.query; // Filtro opcional por estado

      if (!id_usuario) {
        return res.status(400).json({ error: "ID de usuario requerido" });
      }

      // Construir filtro para el historial directamente por id_usuario
const filtro: any = { id_usuario: parseInt(id_usuario) };
if (estado) {
  const estadosValidos = ["pendiente", "entregado", "cancelado"];
  if (!estadosValidos.includes(estado as string)) {
    return res.status(400).json({
      error: "Estado inválido. Debe ser: pendiente, entregado o cancelado"
    });
  }
  filtro.estado = estado;
}


      // Buscar el historial directamente por id_usuario
      const historial = await HistorialPedido.find(filtro).populate('id_pedido');
      
      if (historial.length === 0) {
        return res.status(404).json({ message: 'No se encontró historial para este usuario' });
      }

      res.status(200).json(historial);
    } catch (error) {
      console.error('Error al obtener el historial de pedidos:', error instanceof Error ? error.message : String(error));
      res.status(500).json({ message: 'Error al obtener el historial de pedidos', error });
    }
  }

  // Registrar un cambio de estado o entrega en el historial de un pedido
  static async registrarHistorial(req: Request, res: Response) {
    try {
      const { id_pedido } = req.params;
      const { estado, comentarios, fecha_evento } = req.body;

      // Validaciones básicas
      if (!estado || !['pendiente', 'entregado', 'cancelado'].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido. Debe ser: pendiente, entregado o cancelado" });
      }

      // Verificar si el pedido existe
      const pedidoExistente = await Pedido.findById(id_pedido);
      if (!pedidoExistente) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      // Crear el nuevo historial de pedido
      const nuevoHistorial = new HistorialPedido({
        id_pedido,
        id_usuario: pedidoExistente.id_usuario,
        fecha_evento: fecha_evento ? new Date(fecha_evento) : new Date(),
        estado,
        comentarios: comentarios || `Estado cambiado a: ${estado}`,
      });

      await nuevoHistorial.save();
      res.status(201).json({ mensaje: "Historial registrado exitosamente", historial: nuevoHistorial });
    } catch (error) {
      console.error('Error al registrar el historial del pedido:', error instanceof Error ? error.message : String(error));
      res.status(500).json({ message: 'Error al registrar el historial del pedido', error });
    }
  }
}

export default HistorialController;

