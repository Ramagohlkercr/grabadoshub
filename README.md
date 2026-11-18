# GrabadosHub — Catálogo y Administración

Trabajo Práctico N° 2 — Metodologías y Desarrollos Web  
Universidad Abierta Interamericana (UAI)  
Alumno: Ramiro Gohlke

---

## Enlaces del Proyecto Desplegado

- **Frontend:** [https://grabadoshub-frontend.onrender.com](https://grabadoshub-frontend.onrender.com)
- **Backend (API Health):** [https://grabadoshub-backend.onrender.com/api/health](https://grabadoshub-backend.onrender.com/api/health)
- **Repositorio en GitHub:** [https://github.com/Ramagohlkercr/grabadoshub](https://github.com/Ramagohlkercr/grabadoshub)

---

## 1. Descripción de la Aplicación y Entidad

GrabadosHub es una aplicación web para el catálogo y la administración de productos personalizados de grabado láser (en ecocuero, acrílico, poliamida y accesorios de acero).

Cuenta con dos partes principales:
1. **Catálogo Público (`/`):** Vista para clientes donde se pueden ver los productos, buscar por texto, filtrar por categoría o por stock disponible, y entrar al detalle de cada artículo.
2. **Panel de Administración (`/admin`):** Sección privada protegida por autenticación y rol de administrador, que permite ver métricas de stock y realizar el CRUD completo de productos (crear, editar, eliminar).

### Entidad elegida: `Product`
Campos de la entidad (cumple con más de 4 campos y 4 tipos de datos distintos):
- `_id`: Identificador único (MongoDB ObjectId).
- `name`: Nombre del producto (*string*).
- `description`: Descripción del producto y material (*string*).
- `category`: Categoría (*string*: Ecocuero, Poliamida, Acrílico, Accesorios).
- `price`: Precio en pesos (*number*).
- `stock`: Cantidad en inventario (*number*).
- `available`: Si está disponible para la venta (*boolean*).
- `featured`: Si es producto destacado (*boolean*).
- `imageUrl`: Ruta de la imagen del producto (*string*).
- `createdAt` y `updatedAt`: Fechas de creación y actualización (*Date*).

---

## 2. Usuarios de Prueba para Corrección

Para probar los roles y permisos del sistema:

| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **admin** | `admin@grabadoshub.com` | `AdminGrabados2026!` | Acceso completo al panel `/admin`, crear, editar y borrar productos, y ver métricas. |
| **user** | `usuario@grabadoshub.com` | `UserGrabados2026!` | Solo lectura del catálogo y detalle. Si intenta entrar a `/admin` o usar la API para crear/editar/borrar, recibe 403 Forbidden. |

*Nota: En la pantalla de login (`/login`) se incluyeron botones de auto-completado para cargar cualquiera de estos dos usuarios con un clic.*

---

## 3. Tabla de Endpoints de la API REST

Base URL: `/api`

| Método | Endpoint | Rol Requerido | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Estado de la API y de la conexión a MongoDB | 200 |
| `GET` | `/api/products` | Público | Listado de productos con búsqueda, filtros y paginación | 200, 400 |
| `GET` | `/api/products/:id` | Público | Detalle de un producto por ID | 200, 400, 404 |
| `POST` | `/api/products` | Admin (`role=admin`) | Crear un nuevo producto (validado con Zod) | 201, 400, 401, 403 |
| `PUT` | `/api/products/:id` | Admin (`role=admin`) | Actualizar un producto existente | 200, 400, 401, 403, 404 |
| `PATCH` | `/api/products/:id` | Admin (`role=admin`) | Actualización parcial de un producto | 200, 400, 401, 403, 404 |
| `DELETE` | `/api/products/:id` | Admin (`role=admin`) | Eliminar un producto | 204, 400, 401, 403, 404 |
| `GET` | `/api/products/metrics` | Admin (`role=admin`) | Métricas del catálogo (stock, categorías, totales) | 200, 401, 403 |
| `ALL` | `/api/auth/*` | Según endpoint | Rutas de Better Auth (login, registro, sesión, logout) | 200, 400, 401 |

---

## 4. Tecnologías Utilizadas

- **Frontend:** React 18, Vite, TypeScript, React Router 6, Tailwind CSS, React Hook Form, Zod, Better Auth Client, Lucide React.
- **Backend:** Node.js, Express, TypeScript, MongoDB (Driver oficial), Better Auth, Zod, Helmet, Express Rate Limit.
- **Base de Datos:** MongoDB Atlas (en la nube) con fallback a base en memoria para desarrollo local.
- **Despliegue:** Render (Web Service para backend y Static Site para frontend con reescritura de `/api/*`).

---

## 5. Cómo Correr el Proyecto en Local

### Prerrequisitos
- Node.js (v20 o v22) y npm instalados.
- Git.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ramagohlkercr/grabadoshub.git
cd grabadoshub
```

### 2. Instalar dependencias
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

cd ..
```

### 3. Configurar variables de entorno
Copiar el archivo de ejemplo en el backend:
```bash
cp backend/.env.example backend/.env
```
Variables por defecto para desarrollo local:
- `PORT=4000`
- `MONGODB_URI=mongodb://localhost:27017/grabadoshub`
- `BETTER_AUTH_SECRET=clave_secreta_de_al_menos_32_caracteres_dev`
- `BETTER_AUTH_URL=http://localhost:4000`
- `FRONTEND_URL=http://localhost:5173`

*Nota: Si no tenés una instancia local de MongoDB en marcha, el backend arranca automáticamente una base de datos en memoria para que puedas probarlo sin configurar nada extra.*

### 4. Cargar datos iniciales (Seed)
```bash
# Carga los usuarios de prueba (admin y usuario común)
npm run seed:admin

# Carga los productos de ejemplo en el catálogo
npm run seed:products
```

### 5. Iniciar la aplicación en modo desarrollo
En dos terminales separadas:
```bash
# Terminal 1: Backend (puerto 4000)
npm run dev:backend

# Terminal 2: Frontend (puerto 5173 con proxy hacia /api)
npm run dev:frontend
```
Abrir en el navegador: `http://localhost:5173`

---

## 6. Pruebas Automatizadas

El proyecto incluye 40 pruebas automatizadas que cubren la API, la autenticación, los roles y los componentes del frontend:

```bash
# Ejecutar todas las pruebas
npm test

# O ejecutar por separado:
cd backend && npm test
cd frontend && npm test
```

Las pruebas verifican:
- Endpoints de la API REST (códigos de estado 200, 201, 204, 400, 401, 403, 404).
- Validación de esquemas con Zod ante datos inválidos.
- Registro, login y logout con Better Auth.
- Que todo usuario nuevo reciba el rol `user` por defecto.
- Que el rol `user` no pueda crear, editar ni eliminar productos (recibe 403).
- Que el rol `admin` pueda realizar el CRUD completo.
- Filtros por categoría, stock disponible, buscador y paginación.
- Renderizado de componentes clave en React (tarjetas, formulario de login, estado vacío y pantalla de acceso denegado).

---

## 7. Despliegue en Render

El despliegue está configurado mediante `render.yaml` (Blueprint de Render):
- **Backend:** Servicio web en Node.js conectado al cluster de MongoDB Atlas.
- **Frontend:** Sitio estático compilado con Vite.
- **Reescritura `/api/*`:** El frontend redirige internamente las llamadas a `/api/*` hacia la URL del backend, manteniendo las cookies seguras en el mismo dominio.
- **Manejo de rutas SPA (`/*` hacia `/index.html`):** Permite recargar la página con F5 en cualquier ruta (`/admin`, `/login`, etc.) sin que el servidor responda 404.
