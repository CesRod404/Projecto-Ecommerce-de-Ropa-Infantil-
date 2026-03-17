# 👶 E-Commerce Ropa Infantil

Tienda en línea de ropa infantil con panel de administración completo.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Infraestructura:** Firebase Functions v2 (API), Firebase Hosting (cliente), Firebase Storage (imágenes)
- **Base de datos:** MongoDB Atlas

## Características

- Catálogo de productos por categoría (ropa niño, niña, bautizo, accesorios)
- Filtrado por temporada, rango de edad y tallas
- Subida y gestión de imágenes en Firebase Storage
- Panel de administración protegido con JWT
- Autenticación de usuarios

## Estructura del Proyecto

```
/
├── Project_Ecommerce/
│   └── ecommerce/          # Frontend React + Vite
│       ├── src/
│       └── dist/           # Build de producción
└── functions/              # Backend Firebase Functions v2
    ├── index.js
    ├── routes/
    │   ├── productos.js
    │   ├── auth.js
    │   ├── usuario.js
    │   ├── admin.js
    │   └── pedido.js
    ├── middlewares/
    │   ├── auth.js
    │   └── upload.js
    └── models/
```

## Variables de Entorno

Las siguientes variables se configuran como **secrets** en Firebase:

| Variable | Descripción |
|---|---|
| `MONGO_URI` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |

En el frontend crear un archivo `.env` en `Project_Ecommerce/ecommerce/`:

```env
VITE_API_URL=https://ecommerceropainfantil.web.app
```

## Instalación y Deploy

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd "Proyecto E-comercce"
```

### 2. Instalar dependencias del frontend

```bash
cd Project_Ecommerce/ecommerce
npm install
```

### 3. Instalar dependencias del backend

```bash
cd functions
npm install
```

### 4. Build del frontend

```bash
cd Project_Ecommerce/ecommerce
npm run build
```

### 5. Deploy a Firebase

```bash
# Desde la raíz del proyecto
firebase deploy
```

## Notas Técnicas

- Las funciones usan **Busboy** en lugar de Multer para parsear `multipart/form-data`, ya que Firebase Functions v2 corre sobre Cloud Run y el stream del request requiere manejo manual.
- La conexión a MongoDB usa el patrón **singleton con Promise** para evitar múltiples conexiones en entornos serverless.
- Firebase Hosting reescribe todas las rutas `/api/**` hacia la Cloud Function `api` en `us-central1`.
