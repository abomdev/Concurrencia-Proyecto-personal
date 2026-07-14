# Boletería de Cine

## El problema

Practicar concurrencia: evitar que dos personas reserven el mismo asiento de cine al mismo tiempo, sin depender de suerte en el timing de las peticiones.

## La solución

Un sistema de boletería Full-Stack (Vue 3 + Node.js/Express + SQLite) donde la reserva de un asiento se resuelve con una operación atómica en base de datos, garantizando que ante dos peticiones simultáneas por el mismo asiento, exactamente una tenga éxito.

## Cómo lo resolví

- **UPDATE condicional atómico**: la reserva se hace con `UPDATE asientos SET estado = 'reservado' WHERE id = ? AND estado = 'disponible'`, dentro de una transacción. Si el asiento ya fue tomado, la sentencia afecta 0 filas y el servidor responde `409 Conflict` - no hace falta ningún lock manual, la atomicidad de la sentencia lo resuelve.
- **`node:sqlite` (módulo nativo de Node)**: se evitó instalar un driver con bindings nativos (`better-sqlite3`), aprovechando que Node 22+ trae SQLite embebido.
- **Verificación**: se probó el endpoint disparando dos peticiones HTTP verdaderamente simultáneas contra el mismo asiento, confirmando en la base de datos que solo queda una reserva registrada.

## Features

- Listado de funciones y mapa de butacas por función.
- Reserva de asientos con control de concurrencia a nivel de base de datos.
- Mensaje claro cuando un asiento ya no está disponible.

## Tecnologías

- **Frontend**: [Vue 3](https://vuejs.org/) (Composition API), [Vite](https://vitejs.dev/), [Axios](https://axios-http.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
