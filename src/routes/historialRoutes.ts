import { Router } from 'express';
import HistorialController from '../controllers/HistorialController';

const router = Router();

/**
 * @swagger
 * /historial/{id_usuario}:
 *   get:
 *     summary: Obtener el historial de pedidos de un usuario
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario para obtener su historial de pedidos
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historial de pedidos del usuario
 *       500:
 *         description: Error al obtener el historial de pedidos
 */
router.get('/historial/:id_usuario', HistorialController.obtenerHistorialDeUsuario);

/**
 * @swagger
 * /historial:
 *   post:
 *     summary: Registrar un cambio de estado o entrega en el historial de un pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido:
 *                 type: string
 *               fecha_entrega:
 *                 type: string
 *               estado:
 *                 type: string
 *               comentarios:
 *                 type: string
 *     responses:
 *       201:
 *         description: Historial de pedido registrado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al registrar el historial del pedido
 */
router.post('/historial', HistorialController.registrarHistorial);

export default router;

