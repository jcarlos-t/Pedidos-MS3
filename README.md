# Microservicio de Gestión de Pedidos (MS3)

Microservicio en **Node.js + Express + TypeScript + MongoDB (Mongoose)** para gestionar pedidos y su historial.


## Esquemas (Mongoose)

### Pedido (`src/models/Pedido.ts`)

```json
{
  "_id": "ObjectId",
  "id_usuario": "Number",
  "fecha_pedido": "Date (default: now)",
  "estado": "String (enum: 'pendiente'|'entregado'|'cancelado')",
  "total": "Number",
  "productos": [
    {
      "id_producto": "Number",
      "cantidad": "Number",
      "precio_unitario": "Number"
    }
  ]
}
```

### HistorialPedido (`src/models/HistorialPedido.ts`)

```json
{
  "_id": "ObjectId",
  "id_pedido": "ObjectId (ref: Pedido)",
  "id_usuario": "Number",
  "fecha_evento": "Date (default: now)",
  "estado": "String (enum: 'pendiente'|'entregado'|'cancelado')",
  "comentarios": "String (opcional)"
}
```


---

## Endpoints (rutas reales del código)

### 🔹 Pedidos (`src/routes/pedidoRoutes.ts`)

* **GET** `/pedidos/user/:id_usuario`
  Lista pedidos de un usuario.
  Query opcional: `?estado=pendiente|entregado|cancelado` (coincidencia **exacta**).

* **GET** `/pedidos/:id_pedido`
  Obtiene un pedido por su `_id`.

* **POST** `/pedidos`
  Crea un pedido:

  ```json
  {
    "id_usuario": 14,
    "productos": [
      { "id_producto": 1, "cantidad": 2, "precio_unitario": 10.0 }
    ],
    "total": 20.0
  }
  ```

* **PUT** `/pedidos/:id_pedido/estado`
  Actualiza **solo** el `estado` del pedido:

  ```json
  { "estado": "entregado" }
  ```

* **PUT** `/pedidos/:id_pedido`
  Actualiza otros campos (p. ej. `productos`, `total`).

* **DELETE** `/pedidos/:id_pedido`
  Cancela (soft-delete) o elimina un pedido (en tu lógica cambia a `cancelado` y registra historial).

### 🔹 Historial (`src/routes/historialRoutes.ts`)

* **GET** `/historial/:id_usuario`
  Lista historial por usuario.
  Query opcional: `?estado=pendiente|entregado|cancelado` (coincidencia **exacta**).

* **POST** `/pedidos/:id_pedido/historial`
  Registra evento de historial:

  ```json
  {
    "fecha_evento": "2025-09-27T10:00:00Z",
    "estado": "entregado",
    "comentarios": "Pedido entregado a domicilio"
  }
  ```

---

## Swagger

* **Ruta UI:** `/api-docs`
* **Archivo:** `src/swagger.ts`