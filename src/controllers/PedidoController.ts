import { Request, Response } from "express";
import axios from "axios";
import Pedido from "../models/Pedido";  // Modelo de Pedido
import HistorialPedido from "../models/HistorialPedido"; // Modelo de Historial de Pedido
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Ahora puedes acceder a las variables de entorno con process.env
const MS1_BASE_URL = process.env.MS1_BASE_URL || 'http://localhost:3001'; // URL de MS1
const MS2_BASE_URL = process.env.MS2_BASE_URL || 'http://localhost:3002'; // URL de MS2

// POST: Crear un nuevo pedido
export const crearPedido = async (req: Request, res: Response) => {
    try {
        const { id_usuario, productos, total } = req.body;

        // Solo el POST /pedidos valida el usuario y los productos desde otros microservicios
        // Validación: Verificar que el usuario exista (Microservicio 1)
        const usuario = await axios.get(`${MS1_BASE_URL}/usuarios/${id_usuario}`);
        if (usuario.status !== 200) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Validación: Verificar que todos los productos existan (Microservicio 2)
        const productosInvalidos = [];
        for (let producto of productos) {
            const respuesta = await axios.get(`${MS2_BASE_URL}/productos/${producto.id_producto}`);
            if (respuesta.status !== 200) {
                productosInvalidos.push(producto.id_producto);
            }
        }

        if (productosInvalidos.length > 0) {
            return res.status(404).json({ error: `Productos no encontrados: ${productosInvalidos.join(", ")}` });
        }

        // Crear el pedido si las validaciones pasan
        const nuevoPedido = new Pedido({
            id_usuario,
            productos,
            fecha_pedido: new Date(),
            estado: "pendiente",
            total
        });

        await nuevoPedido.save();

        // Registrar historial de pedido
        const historial = new HistorialPedido({
            id_pedido: nuevoPedido._id,
            fecha_entrega: null,
            estado: "pendiente",
            comentarios: "Pedido en proceso"
        });

        await historial.save();

        return res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al crear el pedido" });
    }
};

// GET: Obtener todos los pedidos de un usuario
export const obtenerPedidosPorUsuario = async (req: Request, res: Response) => {
    try {
        const pedidos = await Pedido.find({ id_usuario: req.params.id_usuario });
        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener los pedidos" });
    }
};

// GET: Obtener un pedido específico
export const obtenerPedidoPorId = async (req: Request, res: Response) => {
    try {
        const pedido = await Pedido.findById(req.params.id_pedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        return res.status(200).json(pedido);
    } catch (error) {
        return res.status(500).json({ error: "Error al obtener el pedido" });
    }
};

// PUT: Actualizar el estado o detalles de un pedido
export const actualizarPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await Pedido.findByIdAndUpdate(req.params.id_pedido, req.body, { new: true });
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        return res.status(200).json(pedido);
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el pedido" });
    }
};

// DELETE: Cancelar o eliminar un pedido
export const eliminarPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id_pedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        return res.status(200).json({ mensaje: "Pedido eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ error: "Error al eliminar el pedido" });
    }
};

