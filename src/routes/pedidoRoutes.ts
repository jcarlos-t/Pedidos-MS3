import { Router } from "express";
import * as PedidoController from "../controllers/PedidoController";

const router = Router();

// Rutas para los pedidos
router.get("/pedidos/:id_usuario", PedidoController.obtenerPedidosPorUsuario);
router.get("/pedidos/detalles/:id_pedido", PedidoController.obtenerPedidoPorId);
router.post("/pedidos", PedidoController.crearPedido);  // Este es el único que consulta a otros microservicios
router.put("/pedidos/:id_pedido", PedidoController.actualizarPedido);
router.delete("/pedidos/:id_pedido", PedidoController.eliminarPedido);

export default router;

