import { Request, Response } from "express";
import axios from "axios";
import Pedido from "../models/Pedido";  // Modelo de Pedido
import HistorialPedido from "../models/HistorialPedido"; // Modelo de Historial de Pedido
import dotenv from 'dotenv';
import mongoose from "mongoose"; 

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const MS1_USUARIOS_API_URL = process.env.MS1_USUARIOS_API_URL || 'http://localhost:3001'; // URL de MS1
const MS2_PRODUCTOS_API_URL = process.env.MS2_PRODUCTOS_API_URL || 'http://localhost:3002'; // URL de MS2

console.log('🔧 URLs de microservicios configuradas:');
console.log(`   MS1 (Usuarios): ${MS1_USUARIOS_API_URL}`);
console.log(`   MS2 (Productos): ${MS2_PRODUCTOS_API_URL}`);

// POST: Crear un nuevo pedido
export const crearPedido = async (req: Request, res: Response) => {
    try {
        console.log('🚀 Iniciando creación de pedido...');
        const { id_usuario, productos, total } = req.body;
        console.log(`📝 Datos recibidos - Usuario: ${id_usuario}, Productos: ${productos?.length}, Total: ${total}`);

        // Validaciones básicas
        if (!id_usuario || !productos || !Array.isArray(productos) || productos.length === 0 || !total) {
            return res.status(400).json({ error: "Faltan campos requeridos: id_usuario, productos (array), total" });
        }

        // Validación: Verificar que el usuario exista (Microservicio 1)
        const usuarioUrl = `${MS1_USUARIOS_API_URL}/usuarios/${id_usuario}`;
        console.log(`🔍 Validando usuario ${id_usuario} con MS1...`);
        console.log(`📡 URL consultada: ${usuarioUrl}`);
        
        try {
            const usuario = await axios.get(usuarioUrl, {
                timeout: 5000, // Timeout de 5 segundos
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📊 Respuesta de MS1 - Status: ${usuario.status}`);
            console.log(`📊 Datos del usuario:`, usuario.data);
            
            if (usuario.status !== 200) {
                console.log(`❌ Usuario ${id_usuario} no encontrado en MS1 (Status: ${usuario.status})`);
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            console.log(`✅ Usuario ${id_usuario} validado correctamente`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(`❌ Error de conexión con MS1:`);
                console.log(`   - URL: ${usuarioUrl}`);
                console.log(`   - Status: ${error.response?.status || 'Sin respuesta'}`);
                console.log(`   - Message: ${error.message}`);
                console.log(`   - Code: ${error.code}`);
                
                if (error.code === 'ECONNREFUSED') {
                    console.log(`❌ MS1 no está ejecutándose en ${MS1_USUARIOS_API_URL}`);
                    return res.status(503).json({ error: "Microservicio de usuarios no disponible" });
                } else if (error.response?.status === 404) {
                    console.log(`❌ Usuario ${id_usuario} no encontrado en MS1`);
                    return res.status(404).json({ error: "Usuario no encontrado" });
                } else {
                    console.log(`❌ Error inesperado de MS1: ${error.response?.status}`);
                    return res.status(500).json({ error: "Error al validar usuario" });
                }
            } else {
                console.log(`❌ Error inesperado:`, error instanceof Error ? error.message : String(error));
                return res.status(500).json({ error: "Error al validar usuario" });
            }
        }

        // Validación: Verificar que todos los productos existan (Microservicio 2)
        console.log(`🔍 Validando ${productos.length} productos con MS2...`);
        const productosInvalidos = [];
        for (let producto of productos) {
            if (!producto.id_producto || !producto.cantidad || !producto.precio_unitario) {
                return res.status(400).json({ error: "Cada producto debe tener id_producto, cantidad y precio_unitario" });
            }
            
            const productoUrl = `${MS2_PRODUCTOS_API_URL}/productos/${producto.id_producto}`;
            console.log(`🔍 Validando producto ${producto.id_producto}...`);
            console.log(`📡 URL consultada: ${productoUrl}`);
            
            try {
                const respuesta = await axios.get(productoUrl, {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log(`📊 Respuesta de MS2 para producto ${producto.id_producto} - Status: ${respuesta.status}`);
                
                if (respuesta.status !== 200) {
                    productosInvalidos.push(producto.id_producto);
                    console.log(`❌ Producto ${producto.id_producto} no encontrado en MS2 (Status: ${respuesta.status})`);
                } else {
                    console.log(`✅ Producto ${producto.id_producto} validado correctamente`);
                }
            } catch (error) {
                productosInvalidos.push(producto.id_producto);
                
                if (axios.isAxiosError(error)) {
                    console.log(`❌ Error de conexión con MS2 para producto ${producto.id_producto}:`);
                    console.log(`   - URL: ${productoUrl}`);
                    console.log(`   - Status: ${error.response?.status || 'Sin respuesta'}`);
                    console.log(`   - Message: ${error.message}`);
                    console.log(`   - Code: ${error.code}`);
                } else {
                    console.log(`❌ Error inesperado validando producto ${producto.id_producto}:`, error instanceof Error ? error.message : String(error));
                }
            }
        }

        if (productosInvalidos.length > 0) {
            console.log(`❌ Productos no encontrados: ${productosInvalidos.join(", ")}`);
            return res.status(404).json({ error: `Productos no encontrados: ${productosInvalidos.join(", ")}` });
        }
        console.log(`✅ Todos los productos validados correctamente`);

        // Crear el pedido si las validaciones pasan
        console.log('💾 Creando pedido en la base de datos...');
        const nuevoPedido = new Pedido({
            id_usuario,
            productos,
            fecha_pedido: new Date(),
            estado: "pendiente",
            total
        });

        await nuevoPedido.save();
        console.log(`✅ Pedido creado con ID: ${nuevoPedido._id}`);

        // Registrar historial de pedido inicial
        console.log('📝 Registrando historial inicial...');
        const historial = new HistorialPedido({
            id_pedido: nuevoPedido._id,
            id_usuario: id_usuario,
            fecha_evento: new Date(),
            estado: "pendiente",
            comentarios: "Pedido creado"
        });

        await historial.save();
        console.log(`✅ Historial registrado con ID: ${historial._id}`);

        console.log('🎉 Pedido creado exitosamente');
        return res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });
    } catch (error) {
        console.error('Error al crear el pedido:', error instanceof Error ? error.message : String(error));
        return res.status(500).json({ error: "Error al crear el pedido" });
    }
};

// GET: Obtener todos los pedidos de un usuario
export const obtenerPedidosPorUsuario = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;

    const idNum = Number(id_usuario);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const { estado } = req.query as { estado?: string };
    const filtro: any = { id_usuario: idNum };
    if (estado) filtro.estado = estado;

    const pedidos = await Pedido.find(filtro);
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error(
      "Error al obtener los pedidos:",
      error instanceof Error ? error.message : String(error)
    );
    return res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};


// GET: Obtener un pedido específico
export const obtenerPedidoPorId = async (req: Request, res: Response) => {
  try {
    const { id_pedido } = req.params;

    if (!mongoose.isValidObjectId(id_pedido)) {
      return res.status(400).json({ error: "ID de pedido inválido" });
    }

    const pedido = await Pedido.findById(id_pedido);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    return res.status(200).json(pedido);
  } catch (error) {
    console.error(
      "Error al obtener el pedido:",
      error instanceof Error ? error.message : String(error)
    );
    return res.status(500).json({ error: "Error al obtener el pedido" });
  }
};


// PUT: Actualizar solo el estado del pedido
export const actualizarEstadoPedido = async (req: Request, res: Response) => {
    try {
        const { id_pedido } = req.params;
        const { estado } = req.body;

        if (!estado || !['pendiente', 'entregado', 'cancelado'].includes(estado)) {
            return res.status(400).json({ error: "Estado inválido. Debe ser: pendiente, entregado o cancelado" });
        }

        const pedido = await Pedido.findByIdAndUpdate(
            id_pedido, 
            { estado }, 
            { new: true }
        );

        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        // Registrar el cambio en el historial
        const historial = new HistorialPedido({
            id_pedido: pedido._id,
            id_usuario: pedido.id_usuario,
            fecha_evento: new Date(),
            estado: estado,
            comentarios: `Estado actualizado a: ${estado}`
        });

        await historial.save();

        return res.status(200).json({ mensaje: "Estado del pedido actualizado exitosamente", pedido });
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error instanceof Error ? error.message : String(error));
        return res.status(500).json({ error: "Error al actualizar el estado del pedido" });
    }
};

// PUT: Actualizar detalles y otros parámetros del pedido
export const actualizarPedido = async (req: Request, res: Response) => {
    try {
        const { id_pedido } = req.params;
        const { productos, total } = req.body;

        const pedido = await Pedido.findById(id_pedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        // Validar productos si se proporcionan
        if (productos) {
            for (let producto of productos) {
                if (!producto.id_producto || !producto.cantidad || !producto.precio_unitario) {
                    return res.status(400).json({ error: "Cada producto debe tener id_producto, cantidad y precio_unitario" });
                }
                
                try {
                    const respuesta = await axios.get(`${MS2_PRODUCTOS_API_URL}/productos/${producto.id_producto}`);
                    if (respuesta.status !== 200) {
                        return res.status(404).json({ error: `Producto no encontrado: ${producto.id_producto}` });
                    }
                } catch (error) {
                    console.log(`❌ Error al validar producto ${producto.id_producto}:`, error instanceof Error ? error.message : String(error));
                    return res.status(404).json({ error: `Producto no encontrado: ${producto.id_producto}` });
                }
            }
        }

        // Actualizar el pedido
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id_pedido,
            { productos, total },
            { new: true }
        );

        // Registrar el cambio en el historial
        const historial = new HistorialPedido({
            id_pedido: pedidoActualizado!._id,
            id_usuario: pedidoActualizado!.id_usuario,
            fecha_evento: new Date(),
            estado: pedidoActualizado!.estado,
            comentarios: "Detalles del pedido actualizados"
        });

        await historial.save();

        return res.status(200).json({ mensaje: "Pedido actualizado exitosamente", pedido: pedidoActualizado });
    } catch (error) {
        console.error('Error al actualizar el pedido:', error instanceof Error ? error.message : String(error));
        return res.status(500).json({ error: "Error al actualizar el pedido" });
    }
};

// DELETE: Cancelar o eliminar un pedido
export const eliminarPedido = async (req: Request, res: Response) => {
    try {
        const { id_pedido } = req.params;
        
        const pedido = await Pedido.findById(id_pedido);
        if (!pedido) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        // Cambiar el estado a cancelado en lugar de eliminar
        const pedidoCancelado = await Pedido.findByIdAndUpdate(
            id_pedido,
            { estado: "cancelado" },
            { new: true }
        );

        // Registrar la cancelación en el historial
        const historial = new HistorialPedido({
            id_pedido: pedidoCancelado!._id,
            id_usuario: pedidoCancelado!.id_usuario,
            fecha_evento: new Date(),
            estado: "cancelado",
            comentarios: "Pedido cancelado"
        });

        await historial.save();

        return res.status(200).json({ mensaje: "Pedido cancelado exitosamente", pedido: pedidoCancelado });
    } catch (error) {
        console.error('Error al cancelar el pedido:', error instanceof Error ? error.message : String(error));
        return res.status(500).json({ error: "Error al cancelar el pedido" });
    }
};

