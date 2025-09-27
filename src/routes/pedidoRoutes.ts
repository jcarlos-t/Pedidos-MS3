// src/routes/pedidoRoutes.ts
import { Router } from "express";
import * as PedidoController from "../controllers/PedidoController";

const router = Router();

/**
 * @swagger
 * /pedidos/{id_usuario}:
 *   get:
 *     summary: Obtener todos los pedidos de un usuario
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario para obtener sus pedidos
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       500:
 *         description: Error al obtener los pedidos
 */
router.get("/pedidos/:id_usuario", PedidoController.obtenerPedidosPorUsuario);

/**
 * @swagger
 * /pedidos/detalles/{id_pedido}:
 *   get:
 *     summary: Obtener detalles de un pedido específico
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido para obtener sus detalles
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener el pedido
 */
router.get("/pedidos/detalles/:id_pedido", PedidoController.obtenerPedidoPorId);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_producto:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *               total:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       500:
 *         description: Error al crear el pedido
 */
router.post("/pedidos", PedidoController.crearPedido);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   put:
 *     summary: Actualizar un pedido
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al actualizar el pedido
 */
router.put("/pedidos/:id_pedido", PedidoController.actualizarPedido);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   delete:
 *     summary: Eliminar un pedido
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al eliminar el pedido
 */
router.delete("/pedidos/:id_pedido", PedidoController.eliminarPedido);

export default router;

