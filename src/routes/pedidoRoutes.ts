// src/routes/pedidoRoutes.ts
import { Router } from "express";
import * as PedidoController from "../controllers/PedidoController";

const router = Router();

/**
 * @swagger
 * /pedidos/user/{id_usuario}:
 *   get:
 *     summary: Obtener todos los pedidos de un usuario (con filtros opcionales)
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         description: ID del usuario para obtener sus pedidos
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         required: false
 *         description: Filtrar pedidos por estado (pendiente, entregado, cancelado)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       400:
 *         description: ID de usuario inválido
 *       500:
 *         description: Error al obtener los pedidos
 */
router.get("/pedidos/user/:id_usuario", PedidoController.obtenerPedidosPorUsuario);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   get:
 *     summary: Obtener un pedido por su ID (ObjectId de MongoDB)
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido (ObjectId de MongoDB)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       400:
 *         description: ID de pedido inválido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener el pedido
 */
router.get("/pedidos/:id_pedido", PedidoController.obtenerPedidoPorId);

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
 *                 type: integer
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               total:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o productos no encontrados
 *       500:
 *         description: Error al crear el pedido
 */
router.post("/pedidos", PedidoController.crearPedido);

/**
 * @swagger
 * /pedidos/{id_pedido}/estado:
 *   put:
 *     summary: Actualizar solo el estado del pedido
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
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al actualizar el estado del pedido
 */
router.put("/pedidos/:id_pedido/estado", PedidoController.actualizarEstadoPedido);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   put:
 *     summary: Actualizar detalles y otros parámetros del pedido
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
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_producto:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               total:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Pedido o productos no encontrados
 *       500:
 *         description: Error al actualizar el pedido
 */
router.put("/pedidos/:id_pedido", PedidoController.actualizarPedido);

/**
 * @swagger
 * /pedidos/{id_pedido}:
 *   delete:
 *     summary: Cancelar o eliminar un pedido
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         description: ID del pedido a cancelar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al cancelar el pedido
 */
router.delete("/pedidos/:id_pedido", PedidoController.eliminarPedido);

export default router;

