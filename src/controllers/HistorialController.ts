import { Request, Response } from 'express';
import HistorialPedido from '../models/HistorialPedido';  // Asegúrate de tener solo una importación

class HistorialController {
  
  // Obtener historial de pedidos de un usuario
  static async obtenerHistorialDeUsuario(req: Request, res: Response) {
    try {
      const { id_usuario } = req.params;
      const historial = await HistorialPedido.find({ id_usuario });
      res.status(200).json(historial);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el historial de pedidos', error });
    }
  }

  // Registrar un cambio de estado o entrega en el historial de un pedido
  static async registrarHistorial(req: Request, res: Response) {
    try {
      const { id_pedido, fecha_entrega, estado, comentarios } = req.body;

      // Verificar si el pedido existe, pero SOLO en la base de datos local
      const pedidoExistente = await HistorialPedido.findById(id_pedido);  // Usar la base de datos local
      if (!pedidoExistente) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      const nuevoHistorial = new HistorialPedido({
        id_pedido,
        fecha_entrega,
        estado,
        comentarios,
      });

      await nuevoHistorial.save();
      res.status(201).json(nuevoHistorial);
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el historial del pedido', error });
    }
  }
}

export default HistorialController;  // Solo una exportación default

