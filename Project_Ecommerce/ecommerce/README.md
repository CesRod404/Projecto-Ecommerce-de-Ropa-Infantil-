# E-commerce Ropa Infantil

Una tienda online especializada en ropa y artículos para bebés y niños, con panel administrativo completo y sistema de gestión de pedidos.

https://guileless-churros-d899af.netlify.app

## 🛍️ Descripción del Proyecto

Este proyecto es una plataforma de comercio electrónico diseñada para la venta de ropa infantil, incluyendo colecciones para bautizos, ropa de niño y niña, y accesorios especiales.

### ✨ Características Principales

- **Tienda Online Completa**: Catálogo organizado por categorías con productos detallados
- **Sistema de Autenticación**: Registro e inicio de sesión seguro con roles de usuario y administrador
- **Gestión de Carrito**: Agregar productos, ajustar cantidades y realizar pedidos
- **Direcciones de Envío**: Gestión completa de direcciones de entrega
- **Panel Administrativo**: CRUD completo para productos, gestión de pedidos y usuarios
- **Responsive Design**: Totalmente adaptable a móviles, tablets y escritorio

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** con Hooks y Context API para gestión de estado
- **React Router DOM** para navegación entre páginas
- **Vite** como herramienta de compilación y desarrollo
- **CSS Moderno** con enfoque en diseño responsivo
- **Despliegue en Netlify**

### Backend
- **Node.js** con Express.js
- **MongoDB** para almacenamiento de datos
- **JWT** para autenticación segura
- **BCrypt** para encriptación de contraseñas
- **Multer** para manejo de imágenes
- **Despliegue en VM con Docker, PM2 y Nginx**

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/          # Páginas principales de la aplicación
│   ├── context/        # Context API para autenticación
│   └── utils/          # Funciones auxiliares
├── blocks/             # Archivos CSS modulares
└── public/             # Recursos estáticos
```

## 💡 Funcionalidades Clave

### Para Usuarios
- 🔍 Navegación por categorías (Bautizos, Niñas, Niños, Accesorios)
- ❤️ Sistema de favoritos/likes
- 🛒 Carrito de compras persistente
- 📍 Gestión de múltiples direcciones de envío
- 📦 Seguimiento de pedidos
- 👤 Perfil de usuario personalizable

### Para Administradores
- ➕ Panel de administración protegido
- 📊 Gestión completa de productos (CRUD)
- 📋 Administración de pedidos con cambio de estados
- 👥 Gestión de usuarios
- 📈 Visibilidad de todas las órdenes del sistema

### Estados de Pedido
1. **Por Confirmar** - Pedido nuevo pendiente de revisión
2. **Confirmado** - Pedido aceptado y preparándose
3. **En Camino** - Pedido enviado al cliente
4. **Cancelado** - Pedido rechazado o cancelado

## ⚙️ Instalación y Configuración

### Requisitos Previos
- Node.js >= 16.x
- npm o yarn
- Acceso al backend (API URL)

### Instalación Frontend

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio del proyecto
cd ecommerce

# Instalar dependencias
npm install

# Crear archivo .env con la URL del API
echo "VITE_API_URL=https://api.backendEcommerce.twilightparadox.com" > .env

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```
VITE_API_URL=https://api.backendEcommerce.twilightparadox.com
```

## 🎯 Características Técnicas

- **Diseño Responsivo**: Adaptado para todos los dispositivos
- **Optimización de Imágenes**: Carga eficiente de recursos visuales
- **Experiencia de Usuario**: Interfaz intuitiva y moderna
- **Seguridad**: Autenticación JWT y protección de rutas
- **Performance**: Bundling optimizado con Vite

## 🌐 Integración con Backend

El frontend se conecta con una API RESTful construida con Node.js/Express que maneja:

- Autenticación de usuarios
- Gestión de productos y categorías
- Procesamiento de pedidos
- Almacenamiento en MongoDB
- Manejo de imágenes y archivos

## 🚀 Despliegue

- **Frontend**: Netlify (CI/CD automatizado)
- **Backend**: VM Ubuntu con Docker containers
- **Base de Datos**: MongoDB Atlas
- **Proxy Inverso**: Nginx
- **Process Manager**: PM2

## 📞 Soporte y Contacto

Para más información sobre el proyecto o cualquier consulta técnica, puedes contactarnos a través de:

📧 Email: [cesarnef@outlook.com]
💼 LinkedIn: [www.linkedin.com/in/cesrodriguezsif]

---

### 🛠 **¡Empieza a vender ropa infantil hoy mismo!**

[¡Visita nuestra tienda en línea!](https://guileless-churros-d899af.netlify.app)