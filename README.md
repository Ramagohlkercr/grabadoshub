# GRABADOSHUB — Plataforma de Catálogo y Administración de Grabados Láser

> **Trabajo Práctico N° 2 — Metodologías y Desarrollos Web**  
> **Universidad Abierta Interamericana (UAI)**  
> **Estado:** Producto Full Stack funcional, testeado y listo para producción académica.

---

## 1. Descripción del Proyecto

**GrabadosHub** es una plataforma SaaS profesional para la exhibición, consulta técnica y administración integral de productos personalizados mediante tecnología de grabado láser CNC y fibra óptica.

El sistema ofrece dos experiencias complementarias:
1. **Catálogo Público (`/`)**: Interfaz premium de exploración para clientes y empresas, con filtros por sustrato/material, buscador de texto en tiempo real, control de disponibilidad en stock, detalle técnico de cada pieza con tolerancias micrométricas y recomendaciones de grabado.
2. **Panel Administrativo (`/admin`)**: Dashboard privado protegido por autenticación y control de acceso estricto por roles (`ADMIN`), con métricas operativas calculadas en tiempo real desde MongoDB, altas, bajas y modificaciones (CRUD) completas con validación Zod y modales de confirmación accesibles.

---

## 2. Objetivos Académicos y de Negocio

- **Arquitectura Limpia & Modular**: Separación nítida de responsabilidades en capas (controladores, servicios, modelos, esquemas, middleware y rutas).
- **Seguridad en Profundidad**: Autenticación moderna con Better Auth, cookies seguras, protección contra CSRF/CORS, cabeceras defensivas con Helmet y limitación de tasa (Rate Limiting).
- **Control de Acceso Basado en Roles (RBAC)**: Autorización en el servidor (`authMiddleware` + `requireRole('admin')`), impidiendo cualquier acceso no autorizado a través de la API REST independientemente del frontend.
- **Validación Estricta**: Esquemas tipados con Zod en backend y frontend con retroalimentación inmediata.
- **Experiencia de Usuario Premium**: Identidad visual inspirada en herramientas como Linear, Stripe y Notion, con paleta sobria, tipografía legible, microinteracciones, estados de carga mediante Skeleton loaders y notificaciones Toast contextuales.

---

## 3. Tecnologías Utilizadas

### Frontend
- **React 18** + **Vite 6** + **TypeScript**: Renderizado veloz y tipado estricto.
- **Tailwind CSS v4**: Sistema de diseño con variables de tema personalizadas.
- **React Router v6**: Enrutamiento declarativo para áreas públicas y rutas protegidas.
- **React Hook Form** + **Zod** (`@hookform/resolvers/zod`): Formularios de alto rendimiento y validación síncrona.
- **Better Auth React Client**: Cliente oficial de autenticación (`createAuthClient` + `adminClient`).
- **Lucide React**: Iconografía consistente y accesible.

### Backend
- **Node.js 22 (LTS)** + **Express 4** + **TypeScript**: Servidor HTTP RESTful estructurado en ESM.
- **Better Auth 1.2+**: Framework de autenticación TypeScript-first con adaptador nativo de MongoDB y plugin de administración de roles.
- **MongoDB 6+ (Native Driver)**: Persistencia NoSQL para usuarios, sesiones, cuentas y catálogo de productos.
- **Helmet**: Cabeceras HTTP seguras (Content-Security-Policy, COOP, CORP).
- **Express Rate Limit**: Mitigación de abusos y fuerza bruta en autenticación y endpoints públicos.
- **Zod**: Validación y sanitización de todas las entradas (parámetros de ruta, queries y cuerpo de requests).

### Testing & Calidad
- **Vitest**: Suite automatizada para backend y frontend con ejecución de 21 tests de integración y componentes.
- **Supertest**: Simulación de requests HTTP con cookies de sesión y verificación de códigos de estado.
- **React Testing Library** + **JSDOM**: Pruebas de accesibilidad, filtros, tarjetas y formularios.
- **MongoDB Memory Server**: Base de datos en memoria para testing y ejecución local sin dependencias externas.

---

## 4. Identidad Visual y Paleta de Colores

| Elemento | Código HEX | Rol en la Interfaz |
| :--- | :--- | :--- |
| **Fondo Principal** | `#F7F6F3` | Lienzo minimalista y cálido |
| **Superficies** | `#FFFFFF` | Tarjetas, modales y contenedores elevados |
| **Texto Principal** | `#20201E` | Contraste óptico máximo para títulos y lectura |
| **Texto Secundario** | `#77756F` | Metadatos, etiquetas y descripciones |
| **Acento Artesanal** | `#A66B50` | Tono terracota que evoca el grabado térmico láser |
| **Verde Positivo** | `#64836D` | Indicadores de stock disponible y estados exitosos |
| **Bordes Sutiles** | `#EAE8E2` | Delimitadores limpios sin sobrecargar la pantalla |

---

## 5. Estructura del Proyecto

El repositorio respeta estrictamente la estructura modular exigida:

```text
/
├── backend/
│   ├── src/
│   │   ├── auth/                # Configuración de Better Auth y plugin admin
│   │   ├── config/              # Base de datos (MongoDB) y variables de entorno Zod
│   │   ├── controllers/         # Controladores HTTP (Products, Health)
│   │   ├── middleware/          # Auth, roles, validación Zod, rate limiter, errores
│   │   ├── models/              # Modelos e interfaces de TypeScript
│   │   ├── routes/              # Definición de rutas REST y middleware encadenado
│   │   ├── schemas/             # Esquemas de validación Zod para productos y queries
│   │   ├── scripts/             # Scripts de seed para admin inicial y productos
│   │   ├── services/            # Lógica de negocio y consultas MongoDB
│   │   ├── tests/               # Pruebas automatizadas de integración
│   │   ├── types/               # Extensión de tipos de Express (Request.user)
│   │   ├── utils/               # Formateadores de respuesta JSON y logger
│   │   ├── app.ts               # Ensamblado de Express, CORS, Helmet y middlewares
│   │   └── server.ts            # Punto de entrada y arranque del servidor
│   ├── .env.example             # Plantilla de variables de entorno para backend
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/
│   ├── public/
│   │   ├── assets/products/     # Ilustraciones SVG locales originales (15 productos)
│   │   └── logo.svg             # Isotipo y logotipo oficial GrabadosHub
│   ├── src/
│   │   ├── assets/              # Assets estáticos del frontend
│   │   ├── components/
│   │   │   ├── admin/           # Sidebar del panel y tarjetas de métricas
│   │   │   ├── common/          # Navbar, Footer, Modal, Skeleton, Toast, EmptyState
│   │   │   └── products/        # Tarjeta de producto, barra de filtros, paginación
│   │   ├── hooks/               # Custom hooks (useProducts, useToast)
│   │   ├── layouts/             # PublicLayout (Navbar+Footer) y AdminLayout
│   │   ├── pages/
│   │   │   ├── admin/           # DashboardPage, ProductsListPage, Create, Edit
│   │   │   ├── HomePage.tsx     # Catálogo principal con buscador y filtros
│   │   │   ├── ProductDetailPage.tsx # Vista detallada y especificaciones técnicas
│   │   │   ├── LoginPage.tsx    # Login con email/password y GitHub OAuth
│   │   │   ├── RegisterPage.tsx # Registro de usuarios regulares
│   │   │   ├── UnauthorizedPage.tsx # Pantalla 403 de acceso denegado
│   │   │   └── NotFoundPage.tsx # Pantalla 404
│   │   ├── routes/              # ProtectedRoute (guardia de rol) y AppRoutes
│   │   ├── services/            # Cliente Better Auth y cliente API REST
│   │   ├── styles/              # CSS base con Tailwind v4
│   │   ├── tests/               # Pruebas automatizadas con React Testing Library
│   │   ├── types/               # Tipos de TypeScript compartidos
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── render.yaml                  # Blueprint de infraestructura como código (Render)
├── package.json                 # Scripts unificados de ejecución y testing
├── README.md                    # Documentación académica completa
└── .gitignore                   # Exclusión de credenciales y dependencias
```

---

## 6. Roles y Permisos

La plataforma cuenta con un sistema de autorización dual:

| Acción / Recurso | Visitante (Público) | Usuario Registrado (`user`) | Administrador (`admin`) |
| :--- | :---: | :---: | :---: |
| **Explorar catálogo con filtros y búsqueda** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Consultar detalle técnico de un producto** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Iniciar sesión / Registrarse** | ✅ Permitido | ✅ Permitido | ✅ Permitido |
| **Ingreso al Panel de Administración (`/admin`)** | ❌ Redirige a Login | ❌ Redirige a 403 Forbidden | ✅ Permitido |
| **Consultar métricas del catálogo (`/api/products/metrics`)** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ Permitido (200) |
| **Crear nuevo producto (`POST /api/products`)** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ Permitido (201) |
| **Editar producto (`PATCH /api/products/:id`)** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ Permitido (200) |
| **Eliminar producto (`DELETE /api/products/:id`)** | ❌ 401 Unauthorized | ❌ 403 Forbidden | ✅ Permitido (204) |

> **Nota de Seguridad**: Todos los usuarios que se registran a través del formulario público reciben de forma inmutable el rol `user`. El rol `admin` no puede ser auto-asignado desde el cliente; se inicializa exclusivamente a través de los procedimientos seguros de Better Auth (`seed:admin`).

---

## 7. Usuarios de Prueba para Evaluación Académica

Para facilitar la corrección y evaluación inmediata, se incluyen botones de auto-completado en la pantalla de inicio de sesión (`/login`) y las siguientes credenciales:

### 👑 Usuario Administrador (Rol: `admin`)
- **Email:** `admin@grabadoshub.com`
- **Contraseña:** `AdminGrabados2026!`
- **Permisos:** Acceso completo al dashboard `/admin`, creación, modificación y eliminación de productos, visualización de métricas reales.

### 👤 Usuario Regular (Rol: `user`)
- **Email:** `usuario@grabadoshub.com`
- **Contraseña:** `UserGrabados2026!`
- **Permisos:** Visualización del catálogo y productos. Si intenta acceder a `/admin`, el servidor responde 403 y la interfaz muestra la pantalla de acceso denegado.

---

## 8. Tabla de Endpoints de la API REST

Base URL: `/api`

| Método | Endpoint | Permiso Requerido | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Público | Estado de la API, uptime y conexión a MongoDB | `200` |
| `GET` | `/api/products` | Público | Listado paginado con búsqueda, filtros y orden | `200`, `400` |
| `GET` | `/api/products/metrics` | **Admin** (`role=admin`) | Estadísticas en tiempo real (totales, stock, categorías) | `200`, `401`, `403` |
| `GET` | `/api/products/:id` | Público | Detalle técnico completo de un producto por ID | `200`, `400`, `404` |
| `POST` | `/api/products` | **Admin** (`role=admin`) | Alta de un nuevo producto validado por Zod | `201`, `400`, `401`, `403` |
| `PATCH` | `/api/products/:id` | **Admin** (`role=admin`) | Modificación parcial de datos de un producto | `200`, `400`, `401`, `403`, `404` |
| `DELETE` | `/api/products/:id` | **Admin** (`role=admin`) | Eliminación permanente de un producto | `204`, `400`, `401`, `403`, `404` |
| `ALL` | `/api/auth/*` | Público / Sesión | Endpoints nativos de Better Auth (login, logout, social) | `200`, `400`, `401` |

---

## 9. Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** v20 o v22 LTS instalado.
- **npm** v10 o superior.
- **Git**.

### Paso 1: Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd "TP WEB"
```

### Paso 2: Instalar dependencias
Podés instalar las dependencias de ambos proyectos ejecutando:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Paso 3: Configurar variables de entorno
Crear el archivo `.env` en la carpeta `backend/`:
```bash
cp backend/.env.example backend/.env
```

### Paso 4: Poblar la base de datos (Seed)
Ejecutá los scripts de inicialización:
```bash
# Crear el usuario administrador y usuario de prueba
npm run seed:admin

# Cargar el catálogo con productos demostrativos de grabado láser
npm run seed:products
```

> **Fallback Inteligente:** Si no tenés una instancia de MongoDB instalada localmente, el backend detecta automáticamente la ausencia del demonio e inicia un servidor embebido con `mongodb-memory-server` sin que tengas que instalar nada adicional.

### Paso 5: Iniciar los servidores de desarrollo
En terminales separadas (o con los scripts del paquete raíz):
```bash
# Terminal 1: Backend (Puerto 4000)
npm run dev:backend

# Terminal 2: Frontend (Puerto 5173 con proxy automático a /api)
npm run dev:frontend
```

Abrí tu navegador en: **`http://localhost:5173`**

---

## 10. Configuración de Variables de Entorno

### Backend (`backend/.env`)

| Variable | Tipo / Ejemplo | Descripción |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` \| `production` | Modo de ejecución del servidor |
| `PORT` | `4000` | Puerto HTTP en el que escucha Express |
| `MONGODB_URI` | `mongodb://localhost:27017/grabadoshub` | URI de conexión a MongoDB local o MongoDB Atlas |
| `BETTER_AUTH_SECRET` | `cadena_aleatoria_de_32_caracteres_minimo!` | Llave criptográfica para firmas de sesión |
| `BETTER_AUTH_URL` | `http://localhost:4000` | URL base de la API de autenticación |
| `FRONTEND_URL` | `http://localhost:5173` | Origen permitido para CORS y redirecciones OAuth |
| `GITHUB_CLIENT_ID` | `tu_client_id` (opcional) | Identificador de aplicación OAuth en GitHub |
| `GITHUB_CLIENT_SECRET` | `tu_client_secret` (opcional) | Secreto de aplicación OAuth en GitHub |

---

## 11. Configuración de GitHub OAuth

Para habilitar el botón "Ingresar con GitHub" en producción o entorno local:

1. Ingresá a [GitHub Developer Settings](https://github.com/settings/developers).
2. Hacé clic en **New OAuth App**.
3. Completá los campos:
   - **Application name:** `GrabadosHub`
   - **Homepage URL:** `http://localhost:5173` (en local) o la URL de Render del frontend.
   - **Authorization callback URL:**  
     `http://localhost:4000/api/auth/callback/github` (en local) o  
     `https://grabadoshub-backend.onrender.com/api/auth/callback/github` (en producción).
4. Generá un nuevo **Client Secret**.
5. Copiá el `Client ID` y `Client Secret` en el archivo `.env` del backend (o en las variables de Render).

---

## 12. Despliegue en Render

El proyecto incluye la especificación declarativa completa en `render.yaml` para despliegue simultáneo en **Render**:

### A. Backend (Web Service)
- **Environment:** Node
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Variables requeridas en Render:**
  - `NODE_ENV`: `production`
  - `MONGODB_URI`: Cadena de conexión de MongoDB Atlas (ej: `mongodb+srv://user:pass@cluster0.mongodb.net/grabadoshub?retryWrites=true&w=majority`)
  - `BETTER_AUTH_SECRET`: Generado automáticamente por Render o cadena aleatoria segura de 32+ caracteres.
  - `BETTER_AUTH_URL`: URL asignada por Render al backend (ej: `https://grabadoshub-backend.onrender.com`).
  - `FRONTEND_URL`: URL asignada por Render al frontend (ej: `https://grabadoshub-frontend.onrender.com`).

### B. Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Reglas de Redirección (Routes en Render):**
  1. **Rewrite de API:**  
     `Source: /api/*` ➡️ `Destination: https://grabadoshub-backend.onrender.com/api/*`
  2. **Rewrite de SPA (Single Page Application):**  
     `Source: /*` ➡️ `Destination: /index.html`

> El frontend consume exclusivamente rutas relativas `/api`, lo cual previene problemas de cookies entre dominios y asegura la persistencia de sesión al recargar la página (F5) o navegar directamente.

---

## 13. Pruebas Automatizadas y Calidad de Código

El proyecto cuenta con **21 pruebas automatizadas** que validan la funcionalidad y seguridad de extremo a extremo:

Para ejecutar todas las pruebas:
```bash
npm test
```

### Resultados de la Suite Automatizada
```text
✓ Backend REST API & Auth Suite (15 tests)
  ✓ GET /api/health retorna 200 y conexión activa a base de datos
  ✓ GET /api/products es público y retorna paginación correcta
  ✓ GET /api/products/:id retorna 400 ante ObjectId con formato inválido
  ✓ GET /api/products/:id retorna 404 ante ID inexistente
  ✓ POST /api/products sin autenticación rechaza con 401 Unauthorized
  ✓ POST /api/products con rol 'user' rechaza con 403 Forbidden
  ✓ POST /api/products con esquema inválido rechaza con 400 Bad Request
  ✓ POST /api/products con rol 'admin' crea el producto con 201 Created
  ✓ GET /api/products/:id retorna los datos del producto creado
  ✓ PATCH /api/products/:id sin permisos admin rechaza con 403 Forbidden
  ✓ PATCH /api/products/:id con rol 'admin' actualiza campos y retorna 200 OK
  ✓ GET /api/products/metrics sin rol admin rechaza con 403 Forbidden
  ✓ GET /api/products/metrics con admin calcula métricas reales de MongoDB
  ✓ DELETE /api/products/:id con usuario regular rechaza con 403 Forbidden
  ✓ DELETE /api/products/:id con admin elimina el producto con 204 No Content

✓ Frontend Components & Pages Suite (6 tests)
  ✓ ProductCard renderiza título, categoría, badge de stock y precio en ARS
  ✓ ProductCard muestra estado 'Sin Stock' cuando la disponibilidad es 0
  ✓ ProductFilter maneja búsqueda, selección de categorías y filtros reactivos
  ✓ EmptyState muestra mensaje amigable y botón de restablecimiento
  ✓ LoginPage renderiza campos, validaciones y auto-completado de credenciales
  ✓ UnauthorizedPage renderiza estado 403 y explicación pedagógica
```

---

## 14. Licencia y Créditos Académicos

Desarrollado como proyecto para el **Trabajo Práctico N° 2 de la materia Metodologías y Desarrollos Web** en la **Universidad Abierta Interamericana (UAI)**.
