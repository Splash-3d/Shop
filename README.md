# EcoStore - Tienda Sostenible con Panel de Administración

Una tienda e-commerce moderna y sostenible inspirada en el diseño de tentree, con un completo panel de administración para gestión de productos en tiempo real.

## 🌟 Características

### Tienda Principal
- **Diseño Moderno**: Interfaz inspirada en tentree con diseño responsivo
- **Catálogo de Productos**: Visualización atractiva con información ambiental
- **Carrito de Compras**: Sistema completo con gestión de cantidades
- **Estadísticas Ambientales**: Muestra árboles plantados y CO₂ reducido
- **Navegación Intuitiva**: Experiencia de usuario optimizada

### Panel de Administración
- **Autenticación Segura**: Sistema de login con contraseñas hasheadas
- **Gestión de Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Dashboard Analítico**: Estadísticas en tiempo real
- **Búsqueda y Filtros**: Búsqueda avanzada de productos
- **Actualizaciones en Tiempo Real**: Cambios reflejados instantáneamente

## 🚀 Instalación

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd Web_shopify
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```
   
   Para desarrollo con auto-reinicio:
   ```bash
   npm run dev
   ```

4. **Acceder a la aplicación**
   - Tienda principal: http://localhost:3000
   - Panel admin: http://localhost:3000/admin/login.html

## 🔐 Credenciales de Acceso

### Panel de Administración
- **Usuario**: `admin` | **Contraseña**: `admin123`
- **Usuario**: `ecostore` | **Contraseña**: `eco2024`

> ⚠️ **Importante**: En producción, cambia estas contraseñas por unas seguras.

## 📁 Estructura del Proyecto

```
Web_shopify/
├── index.html              # Página principal de la tienda
├── styles.css              # Estilos globales
├── app.js                  # Lógica de la tienda
├── server.js               # Servidor Node.js con API
├── package.json            # Dependencias del proyecto
├── admin/                  # Panel de administración
│   ├── login.html          # Página de login admin
│   ├── login.js            # Lógica de autenticación
│   ├── dashboard.html      # Panel principal admin
│   └── dashboard.js        # Lógica del dashboard
└── README.md               # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones
- **JavaScript ES6+**: Lógica de la aplicación
- **Bootstrap 5**: Framework CSS responsivo
- **Font Awesome**: Iconos

### Backend
- **Node.js**: Servidor JavaScript
- **Express.js**: Framework web
- **Crypto**: Módulo para hash de contraseñas

### Características de Seguridad
- **Hash SHA-256**: Contraseñas almacenadas de forma segura
- **Sesiones Token-based**: Gestión de sesiones segura
- **Validación de Inputs**: Protección contra inyección

## 📊 Funcionalidades del Panel Admin

### Dashboard Principal
- Estadísticas en tiempo real
- Productos totales
- Pedidos realizados
- Ingresos generados
- Árboles plantados

### Gestión de Productos
- **Añadir Productos**: Formulario completo con validación
- **Editar Productos**: Modificación de cualquier campo
- **Eliminar Productos**: Confirmación segura
- **Cambiar Estado**: Activar/Desactivar productos
- **Gestión de Stock**: Control de inventario

### Búsqueda y Filtros
- Búsqueda por nombre y descripción
- Filtrado por categoría
- Filtrado por estado (activo/inactivo)

## 🔄 Actualizaciones en Tiempo Real

El sistema implementa actualizaciones en tiempo real mediante:

- **Polling Automático**: Verificación cada 30 segundos
- **Actualización Inmediata**: Cambios en productos se reflejan al instante
- **Sincronización de Datos**: Consistencia entre tienda y panel admin

## 🌱 Impacto Ambiental

Cada producto incluye métricas ambientales:
- **Árboles Plantados**: Contribución por cada compra
- **CO₂ Reducido**: Impacto en emisiones de carbono
- **Materiales Sostenibles**: Información sobre componentes ecológicos

## 🎨 Personalización

### Cambiar Colores y Tema
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-green: #2d5016;
    --light-green: #4a7c28;
    --accent-green: #6fa34d;
    --success-green: #28a745;
}
```

### Añadir Nuevas Categorías
1. Actualiza el formulario en `dashboard.html`
2. Modifica el filtro en `dashboard.js`
3. Actualiza las opciones en el frontend

## 🚀 Despliegue

### Para Producción
1. **Configurar variables de entorno**
2. **Usar base de datos real** (MongoDB, PostgreSQL)
3. **Implementar HTTPS**
4. **Configurar dominio personalizado**
5. **Optimizar recursos** (minificación, CDN)

### Sugerencias de Mejora
- Integración con pasarelas de pago
- Sistema de notificaciones por email
- Base de datos MongoDB/PostgreSQL
- WebSockets para actualizaciones reales
- Sistema de reviews de productos
- Gestión de usuarios y perfiles

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Puerto en uso**: Cambia el puerto en `server.js`
2. **Dependencias faltantes**: Ejecuta `npm install`
3. **Error de login**: Verifica credenciales en `server.js`

### Logs y Debug
- Consola del navegador para errores frontend
- Terminal para errores del servidor
- Network tab para verificar llamadas API

## 📝 Licencia

MIT License - Puedes usar este proyecto para fines comerciales y personales.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork del proyecto
2. Crear una rama de características
3. Hacer commit de los cambios
4. Abrir un Pull Request

---

**EcoStore** - Compra consciente, impacto positivo 🌍♻️
