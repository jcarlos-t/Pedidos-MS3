# Logging y Testing - Microservicio de Pedidos

## 📊 Sistema de Logging

### Características del Logging
- **Logs de solicitudes**: Registra todas las peticiones HTTP con timestamp, método, URL, IP y User-Agent
- **Logs de validación**: Muestra el proceso de validación de usuarios y productos con MS1 y MS2
- **Logs de operaciones**: Registra creación, actualización y cancelación de pedidos
- **Logs de historial**: Muestra el registro automático de cambios en el historial
- **Logs de errores**: Registra errores con stack trace completo
- **Logs con colores**: Usa colores para diferenciar tipos de logs (verde=éxito, rojo=error, amarillo=warning)

### Ejemplo de Logs en Terminal
```
[2024-01-15T10:30:00.000Z] POST /api/pedidos - IP: ::1 - User-Agent: PostmanRuntime/7.32.3
[2024-01-15T10:30:00.000Z] Request Body: {
  "id_usuario": 1,
  "productos": [
    {
      "id_producto": 101,
      "cantidad": 2,
      "precio_unitario": 15.5
    }
  ],
  "total": 31
}
🚀 Iniciando creación de pedido...
📝 Datos recibidos - Usuario: 1, Productos: 1, Total: 31
🔍 Validando usuario 1 con MS1...
✅ Usuario 1 validado correctamente
🔍 Validando 1 productos con MS2...
✅ Producto 101 validado correctamente
✅ Todos los productos validados correctamente
💾 Creando pedido en la base de datos...
✅ Pedido creado con ID: 507f1f77bcf86cd799439011
📝 Registrando historial inicial...
✅ Historial registrado con ID: 507f1f77bcf86cd799439012
🎉 Pedido creado exitosamente
[2024-01-15T10:30:01.000Z] Response: 201
```

## 🧪 Colección de Postman

### Características de la Colección
- **10 endpoints completos** con ejemplos realistas
- **Variables automáticas** que se actualizan dinámicamente
- **Scripts de test** para capturar IDs de pedidos
- **Descripciones detalladas** de cada endpoint
- **Datos de ejemplo** con precios decimales realistas
- **Filtros y parámetros** para testing completo

### Endpoints Incluidos

#### Pedidos
1. **Crear Pedido** - POST `/pedidos`
   - Valida usuario con MS1 y productos con MS2
   - Crea historial automáticamente
   - Guarda ID del pedido en variable

2. **Obtener Pedidos de Usuario** - GET `/pedidos/{id_usuario}`
   - Lista todos los pedidos de un usuario

3. **Obtener Pedido por ID** - GET `/pedidos/{id_pedido}`
   - Detalles de un pedido específico

4. **Actualizar Estado** - PUT `/pedidos/{id_pedido}/estado`
   - Cambia solo el estado del pedido
   - Registra cambio en historial

5. **Actualizar Detalles** - PUT `/pedidos/{id_pedido}`
   - Modifica productos y total
   - Valida productos con MS2

6. **Cancelar Pedido** - DELETE `/pedidos/{id_pedido}`
   - Cambia estado a "cancelado"
   - Registra cancelación en historial

#### Historial
7. **Obtener Historial de Usuario** - GET `/historial/{id_usuario}`
   - Historial completo de un usuario

8. **Historial con Filtro** - GET `/historial/{id_usuario}?estado=entregado`
   - Historial filtrado por estado

9. **Registrar Historial** - POST `/pedidos/{id_pedido}/historial`
   - Registro manual de cambios

10. **Historial con Fecha Personalizada** - POST `/pedidos/{id_pedido}/historial`
    - Registro con fecha específica

### Variables de la Colección
- `baseUrl`: http://localhost:3003
- `id_usuario`: 1 (configurable)
- `id_pedido`: Se actualiza automáticamente al crear pedidos

## 🚀 Instrucciones de Uso

### 1. Configurar el Servidor
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (.env)
MS1_USUARIOS_API_URL=http://localhost:3001
MS2_PRODUCTOS_API_URL=http://localhost:3002
MONGO_URI=mongodb://localhost:27017/ms3
PORT=3003

# Iniciar servidor
npm start
```

### 2. Importar Colección en Postman
1. Abrir Postman
2. Click en "Import"
3. Seleccionar el archivo `postman_collection.json`
4. La colección se importará con todas las variables configuradas

### 3. Flujo de Testing Recomendado
1. **Crear Pedido** (endpoint #1) - Esto guardará el ID del pedido
2. **Obtener Pedido por ID** (endpoint #3) - Verificar creación
3. **Actualizar Estado** (endpoint #4) - Cambiar a "entregado"
4. **Obtener Historial** (endpoint #7) - Ver historial completo
5. **Registrar Historial Manual** (endpoint #9) - Agregar evento personalizado

### 4. Monitorear Logs
Los logs aparecerán en la terminal donde se ejecuta el servidor, mostrando:
- Todas las solicitudes HTTP
- Proceso de validación con microservicios
- Operaciones de base de datos
- Errores y excepciones

## 🔧 Configuración Avanzada

### Personalizar Logs
Para modificar el nivel de logging, editar `src/middleware/logger.ts`:
- Cambiar formato de timestamp
- Agregar más información
- Modificar colores de output

### Variables de Postman
Para cambiar la configuración:
1. Click en la colección
2. Ir a "Variables" tab
3. Modificar valores según necesidad

### Testing con Diferentes Datos
- Cambiar `id_usuario` en variables
- Modificar productos en los bodies
- Usar diferentes estados en los filtros

## 📝 Notas Importantes

- **MS1 y MS2**: Asegúrate de que los microservicios de usuarios y productos estén ejecutándose
- **Base de Datos**: MongoDB debe estar disponible en la URI configurada
- **Puerto**: El servidor corre en puerto 3003 por defecto
- **CORS**: Configurado para aceptar todas las orígenes en desarrollo

## 🐛 Troubleshooting

### Error de Conexión a MS1/MS2
```
❌ Error al validar usuario 1: connect ECONNREFUSED
```
**Solución**: Verificar que MS1 y MS2 estén ejecutándose

### Error de MongoDB
```
Error al conectar a MongoDB: MongoNetworkError
```
**Solución**: Verificar que MongoDB esté ejecutándose y la URI sea correcta

### Variable id_pedido Vacía
**Solución**: Ejecutar primero "Crear Pedido" para que se guarde el ID automáticamente
