# Microservicio de Gestión de Pedidos

Este microservicio gestiona la creación, consulta y actualización de pedidos realizados por los usuarios, así como el historial de estos pedidos. Está basado en Node.js, Express, y MongoDB.

## Descripción

Este microservicio permite:

* Crear un nuevo pedido.
* Consultar los pedidos de un usuario.
* Obtener detalles de un pedido específico.
* Actualizar el estado de un pedido.
* Registrar cambios en el historial de pedidos.

Utiliza una base de datos **MongoDB** para almacenar los pedidos y su historial.

## Endpoints

### Pedidos

1. **Obtener todos los pedidos de un usuario**

   * **Endpoint:** `GET /pedidos/{id_usuario}`
   * **Descripción:** Recupera todos los pedidos de un usuario específico.
   * **Parámetros:**

     * `id_usuario` (URL): ID del usuario.
   * **Respuesta:**

     * Código: 200 OK
     * Cuerpo: Lista de pedidos.

2. **Obtener detalles de un pedido específico**

   * **Endpoint:** `GET /pedidos/{id_pedido}`
   * **Descripción:** Recupera los detalles de un pedido por su ID.
   * **Parámetros:**

     * `id_pedido` (URL): ID del pedido.
   * **Respuesta:**

     * Código: 200 OK
     * Cuerpo: Detalles del pedido.

3. **Crear un nuevo pedido**

   * **Endpoint:** `POST /pedidos`
   * **Descripción:** Crea un nuevo pedido.
   * **Cuerpo:**

     ```json
     {
       "id_usuario": 123,
       "productos": [
         { "id_producto": 1, "cantidad": 2, "precio_unitario": 10.0 },
         { "id_producto": 2, "cantidad": 1, "precio_unitario": 20.0 }
       ],
       "total": 40.0
     }
     ```
   * **Respuesta:**

     * Código: 201 Created
     * Cuerpo: Detalles del pedido creado.

4. **Actualizar el estado o detalles de un pedido**

   * **Endpoint:** `PUT /pedidos/{id_pedido}`
   * **Descripción:** Actualiza el estado o los detalles de un pedido.
   * **Parámetros:**

     * `id_pedido` (URL): ID del pedido a actualizar.
   * **Cuerpo:**

     ```json
     {
       "estado": "entregado"
     }
     ```
   * **Respuesta:**

     * Código: 200 OK
     * Cuerpo: Detalles del pedido actualizado.

5. **Eliminar un pedido**

   * **Endpoint:** `DELETE /pedidos/{id_pedido}`
   * **Descripción:** Elimina un pedido por su ID.
   * **Parámetros:**

     * `id_pedido` (URL): ID del pedido a eliminar.
   * **Respuesta:**

     * Código: 200 OK
     * Cuerpo: Confirmación de eliminación.

### Historial de Pedidos

1. **Obtener el historial de pedidos de un usuario**

   * **Endpoint:** `GET /historial/{id_usuario}`
   * **Descripción:** Recupera el historial de pedidos de un usuario específico.
   * **Parámetros:**

     * `id_usuario` (URL): ID del usuario.
   * **Respuesta:**

     * Código: 200 OK
     * Cuerpo: Lista del historial de pedidos.

2. **Registrar un cambio en el historial de un pedido**

   * **Endpoint:** `POST /historial`
   * **Descripción:** Registra un cambio de estado o entrega en el historial de un pedido.
   * **Cuerpo:**

     ```json
     {
       "id_pedido": "60c72b1f9e7b1f6d4e4a9e1f",
       "fecha_entrega": "2025-09-27T10:00:00Z",
       "estado": "entregado",
       "comentarios": "Pedido entregado a domicilio"
     }
     ```
   * **Respuesta:**

     * Código: 201 Created
     * Cuerpo: Detalles del historial registrado.

## Instalación

Para instalar y ejecutar este microservicio, sigue estos pasos:

1. **Clona el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Asegúrate de tener un archivo `.env` configurado correctamente con las siguientes variables:

   ```env
   MONGO_URI=mongodb://localhost:27017/pedidos
   PORT=3000
   ```

4. **Inicia el servidor:**

   ```bash
   npm start
   ```

   El microservicio estará disponible en `http://localhost:3000`.

## Estructura del Proyecto

```
/src
  /controllers
    PedidoController.ts
    HistorialController.ts
  /models
    Pedido.ts
    HistorialPedido.ts
  /routes
    pedidoRoutes.ts
    historialRoutes.ts
  /middleware
    error.ts
  index.ts
  swagger.ts
  tsconfig.json
```

## Dependencias

* `express`: Framework web para Node.js.
* `mongoose`: ODM para interactuar con MongoDB.
* `axios`: Para realizar solicitudes HTTP.
* `dotenv`: Para manejar variables de entorno.
* `cors`: Para manejar las solicitudes de recursos cruzados.

## Contribuciones

Si deseas contribuir al proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/mi-nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -am 'Agrega mi nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/mi-nueva-funcionalidad`).
5. Abre un Pull Request.


Esquema de la colección "Pedidos":
{
  "_id": "ObjectId",               // ID único del pedido, generado por MongoDB
  "id_usuario": "INT",             // ID del usuario que hizo el pedido (referencia a la tabla de Usuarios)
  "fecha_pedido": "ISODate",       // Fecha en que se realizó el pedido
  "estado": "STRING",              // Estado del pedido (ejemplo: "pendiente", "entregado", "cancelado")
  "total": "DECIMAL(10, 2)",       // Total del pedido (suma de los productos y otros cargos)
  "productos": [                   // Array de productos en el pedido
    {
      "id_producto": "INT",         // ID del producto (referencia a la tabla de Productos)
      "cantidad": "INT",            // Cantidad del producto en el pedido
      "precio_unitario": "DECIMAL(10, 2)"  // Precio por unidad del producto
    }
  ]
}


Esquema de la colección "Historial de Pedidos":
{
  "_id": "ObjectId",              // ID único del historial de cambios, generado por MongoDB
  "id_pedido": "ObjectId",         // Referencia al ID del pedido (relación con la colección de Pedidos)
  "fecha_evento": "ISODate",      // Fecha de entrega, si aplica (o la fecha relevante del evento)
  "estado": "STRING",              // El estado del pedido en ese momento (ejemplo: "entregado", "cancelado")
  "comentarios": "TEXT"            // Comentarios o notas sobre el estado o la situación del pedido
}


Pedidos:

GET /pedidos/{id_usuario}: Obtener todos los pedidos de un usuario (con filtros opcionales).

GET /pedidos/{id_pedido}: Obtener detalles de un pedido específico.

POST /pedidos: Crear un nuevo pedido.

PUT /pedidos/{id_pedido}/estado: Actualizar solo el estado del pedido.

DELETE /pedidos/{id_pedido}: Cancelar o eliminar un pedido (con validaciones).

Historial de Pedidos:

GET /historial/{id_usuario}: Obtener historial de pedidos de un usuario (con filtros opcionales).

POST /pedidos/{id_pedido}/historial: Registrar un cambio de estado o entrega en el historial de un pedido.