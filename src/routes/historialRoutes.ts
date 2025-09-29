import { Router } from 'express';
import HistorialController from '../controllers/HistorialController';

const router = Router();

/**
 * @swagger
 * /historial/{id_usuario}:
 *   get:
 *     summary: Obtener historial de pedidos de un usuario (con filtros opcionales de estado)
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario para obtener su historial de pedidos
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         required: false
 *         description: Filtrar por estado del pedido
 *         schema:
 *           type: string
 *           enum: [pendiente, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Historial de pedidos del usuario
 *       404:
 *         description: No se encontraron pedidos o historial para este usuario
 *       500:
 *         description: Error al obtener el historial de pedidos
 */
router.get('/historial/:id_usuario', HistorialController.obtenerHistorialDeUsuario);

/**
 * @swagger
 * /pedidos/{id_pedido}/historial:
 *   post:
 *     summary: Registrar un cambio de estado o entrega en el historial de un pedido
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido para registrar historial
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, entregado, cancelado]
 *               comentarios:
 *                 type: string
 *               fecha_evento:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del evento (opcional, por defecto usa la fecha actual)
 *     responses:
 *       201:
 *         description: Historial de pedido registrado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al registrar el historial del pedido
 */
router.post('/pedidos/:id_pedido/historial', HistorialController.registrarHistorial);

export default router;

