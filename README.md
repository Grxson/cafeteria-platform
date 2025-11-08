# Plataforma de Cafetería

Sistema de e-commerce para cafetería desarrollado con Laravel, React e Inertia.js

## 📋 Sitemap de la Plataforma

### 🌐 Rutas Públicas (Sin Autenticación)

#### Página Principal
- **Home** `/` - Página de bienvenida

#### Tienda
- **Tienda Pública** `/tienda-publica` - Catálogo de productos visible sin autenticación

#### Autenticación
- **Iniciar Sesión** `/login` - Formulario de inicio de sesión
- **Registro** `/register` - Registro general de usuarios
- **Registro de Cliente** `/registro` - Registro específico para clientes
- **Olvidé mi Contraseña** `/forgot-password` - Solicitud de recuperación de contraseña
- **Restablecer Contraseña** `/reset-password/{token}` - Formulario para nueva contraseña

#### Verificación de Email
- **Verificar Email** `/verify-email` - Aviso de verificación
- **Confirmar Email** `/verify-email/{id}/{hash}` - Link de confirmación
- **Reenviar Verificación** `/email/verification-notification` - Reenvío de email de verificación

---

### 👤 ROL: CLIENTE

> **Middleware requerido**: `auth`, `verified`, `client`
> **Prefijo de rutas**: `/cliente`

#### Dashboard
- **Dashboard Principal** `/cliente/dashboard` - Panel principal del cliente

#### Tienda y Productos
- **Catálogo de Productos** `/cliente/tienda` - Listado de productos disponibles
- **Detalle de Producto** `/cliente/producto/{id}` - Información detallada del producto
- **Preview Checkout Producto** `/cliente/producto/{id}/checkout-preview` - Vista previa antes de compra directa

#### Carrito de Compras
- **Ver Carrito** `/cliente/carrito` - Visualización del carrito
- **Preview Checkout** `/cliente/carrito/checkout-preview` - Vista previa antes del pago
- **Agregar al Carrito** `POST /cliente/carrito/agregar` - Añadir producto
- **Actualizar Cantidad** `PUT /cliente/carrito/actualizar/{id}` - Modificar cantidad
- **Quitar Producto** `DELETE /cliente/carrito/quitar/{id}` - Eliminar producto del carrito
- **Vaciar Carrito** `DELETE /cliente/carrito/vaciar` - Limpiar todo el carrito
- **Contador de Items** `GET /cliente/carrito/count` - Cantidad de productos en carrito

#### Compra
- **Comprar Directamente** `POST /cliente/comprar-directo` - Compra rápida sin carrito

#### Procesamiento de Pagos (Stripe)
- **Crear Sesión de Pago** `POST /cliente/stripe/checkout-session` - Iniciar pago desde carrito
- **Pago Directo** `POST /cliente/stripe/checkout-session-direct` - Iniciar pago directo
- **Pago Exitoso** `/stripe/success` - Página de confirmación tras pago

#### Pedidos
- **Mis Pedidos** `/cliente/pedidos` - Historial de pedidos del cliente

#### Facturas
- **Descargar Factura** `/cliente/factura/{id}/descargar` - Descarga PDF de factura
- **Ver Factura** `/cliente/factura/{id}/ver` - Visualizar factura en navegador

#### Comentarios y Calificaciones
- **Crear Comentario** `POST /cliente/comentarios` - Dejar comentario en producto comprado
- **Comentario Libre** `POST /cliente/comentarios/libre` - Comentario sin restricción de compra
- **Actualizar Comentario** `PUT /cliente/comentarios/{id}` - Editar comentario propio
- **Eliminar Comentario** `DELETE /cliente/comentarios/{id}` - Borrar comentario propio
- **Ver Comentarios** `GET /cliente/producto/{id}/comentarios` - Listar comentarios de producto
- **Estadísticas de Comentarios** `GET /cliente/producto/{id}/estadisticas` - Métricas de calificaciones
- **Verificar Permiso** `GET /cliente/producto/{id}/puede-comentar` - Verificar si puede comentar

#### Perfil
- **Editar Perfil** `/profile` - Modificar datos personales
- **Actualizar Perfil** `PATCH /profile` - Guardar cambios de perfil
- **Eliminar Cuenta** `DELETE /profile` - Borrar cuenta de usuario
- **Confirmar Contraseña** `/confirm-password` - Confirmar contraseña para acciones sensibles
- **Cambiar Contraseña** `PUT /password` - Actualizar contraseña

---

### 🔐 ROL: ADMINISTRADOR

> **Middleware requerido**: `auth`, `verified`, `admin`
> **Prefijo de rutas**: `/admin`

#### Dashboard
- **Dashboard Admin** `/admin/dashboard` - Panel de control administrativo

#### Gestión de Productos
- **Listar Productos** `/admin/productos` - Tabla de todos los productos
- **Crear Producto** `/admin/productos/create` - Formulario de nuevo producto
- **Ver Producto** `/admin/productos/{id}` - Detalle completo del producto
- **Editar Producto** `/admin/productos/{id}/edit` - Formulario de edición
- **Actualizar Producto** `PUT /admin/productos/{id}` - Guardar cambios
- **Eliminar Producto** `DELETE /admin/productos/{id}/delete` - Borrar producto (eliminación lógica)
- **Cambiar Estado** `PATCH /admin/productos/{id}/toggle-status` - Activar/desactivar producto
- **Desactivar Producto** `PATCH /admin/productos/{id}/deactivate` - Desactivar específicamente
- **DataTable Productos** `POST /admin/productos/cargar-dt` - Carga de datos para tabla

#### Gestión de Usuarios
- **Listar Usuarios** `/admin/usuarios` - Tabla de todos los usuarios
- **Ver Usuario** `/admin/usuarios/{id}` - Detalle del usuario
- **Editar Usuario** `/admin/usuarios/{id}/edit` - Formulario de edición de usuario
- **Actualizar Usuario** `PUT /admin/usuarios/{id}` - Guardar cambios de usuario
- **Cambiar Estado** `PATCH /admin/usuarios/{id}/toggle-status` - Activar/desactivar usuario
- **DataTable Usuarios** `POST /admin/usuarios/cargar-dt` - Carga de datos para tabla
- **Estadísticas de Usuarios** `GET /admin/usuarios/estadisticas` - Métricas generales

#### Gestión de Pedidos
- **Listar Pedidos** `/admin/pedidos` - Tabla de todos los pedidos
- **Ver Pedido** `/admin/pedidos/{id}` - Detalle completo del pedido
- **Editar Pedido** `/admin/pedidos/{id}/edit` - Formulario de edición
- **Actualizar Pedido** `PUT /admin/pedidos/{id}` - Guardar cambios
- **Eliminar Pedido** `DELETE /admin/pedidos/{id}` - Borrar pedido
- **Actualizar Estado** `PATCH /admin/pedidos/{id}/update-status` - Cambiar estado del pedido
- **Filtrar por Estado** `GET /admin/pedidos/estado/{estado}` - Pedidos según estado
- **DataTable Pedidos** `POST /admin/pedidos/cargar-dt` - Carga de datos para tabla
- **Estadísticas de Pedidos** `GET /admin/pedidos/estadisticas` - Métricas de ventas

#### Gestión de Comentarios
- **Listar Comentarios** `/admin/comentarios` - Tabla de todos los comentarios
- **Ver Comentario** `/admin/comentarios/{id}` - Detalle del comentario
- **Editar Comentario** `/admin/comentarios/{id}/edit` - Formulario de edición
- **Actualizar Comentario** `PUT /admin/comentarios/{id}` - Guardar cambios
- **Eliminar Comentario** `DELETE /admin/comentarios/{id}` - Borrar comentario
- **Actualizar Estado** `PATCH /admin/comentarios/{id}/update-status` - Aprobar/rechazar comentario
- **Actualización Masiva** `POST /admin/comentarios/bulk-update-status` - Cambiar estado múltiple
- **Filtrar por Estado** `GET /admin/comentarios/estado/{estado}` - Comentarios según estado
- **DataTable Comentarios** `POST /admin/comentarios/cargar-dt` - Carga de datos para tabla
- **Estadísticas de Comentarios** `GET /admin/comentarios/estadisticas` - Métricas de calificaciones

#### Reportes
- **Dashboard de Reportes** `/admin/reportes` - Panel de reportes y analíticas
- **DataTable Reportes** `POST /admin/reportes/cargar-dt` - Carga de datos para reportes
- **Estadísticas Generales** `GET /admin/reportes/estadisticas` - Métricas generales del sistema

---

## 🎨 Estructura de Vistas (React/Inertia.js)

### Páginas Públicas
- `Pages/Welcome.jsx` - Página principal
- `Pages/Auth/Login.jsx` - Inicio de sesión
- `Pages/Auth/Register.jsx` - Registro
- `Pages/Auth/ForgotPassword.jsx` - Recuperar contraseña
- `Pages/Auth/ResetPassword.jsx` - Nueva contraseña
- `Pages/Auth/VerifyEmail.jsx` - Verificación de email
- `Pages/Auth/ConfirmPassword.jsx` - Confirmar contraseña

### Cliente
- `Pages/Clientes/Dashboard.jsx` - Dashboard del cliente
- `Pages/Clientes/Tienda.jsx` - Catálogo de productos
- `Pages/Clientes/ProductoDetalle.jsx` - Detalle del producto
- `Pages/Clientes/Carrito.jsx` - Carrito de compras
- `Pages/Clientes/CheckoutPreview.jsx` - Vista previa de compra
- `Pages/Clientes/Pedidos.jsx` - Historial de pedidos

### Administrador
- `Pages/Admin/Dashboard.jsx` - Dashboard administrativo
- **Productos:**
  - `Pages/Admin/Productos/Index.jsx` - Listado
  - `Pages/Admin/Productos/Create.jsx` - Crear
  - `Pages/Admin/Productos/Show.jsx` - Ver
  - `Pages/Admin/Productos/Edit.jsx` - Editar
- **Usuarios:**
  - `Pages/Admin/Usuarios/Index.jsx` - Listado
  - `Pages/Admin/Usuarios/Show.jsx` - Ver
  - `Pages/Admin/Usuarios/Edit.jsx` - Editar
- **Pedidos:**
  - `Pages/Admin/Pedidos/Index.jsx` - Listado
  - `Pages/Admin/Pedidos/Show.jsx` - Ver
  - `Pages/Admin/Pedidos/Edit.jsx` - Editar
- **Comentarios:**
  - `Pages/Admin/Comentarios/Index.jsx` - Listado
  - `Pages/Admin/Comentarios/Show.jsx` - Ver
  - `Pages/Admin/Comentarios/Edit.jsx` - Editar
- **Reportes:**
  - `Pages/Admin/Reportes/Index.jsx` - Dashboard de reportes

### Perfil (Compartido)
- `Pages/Profile/Edit.jsx` - Edición de perfil

---

## 🔑 Roles y Permisos

### Cliente (`client`)
- ✅ Navegar catálogo de productos
- ✅ Agregar productos al carrito
- ✅ Realizar compras con Stripe
- ✅ Ver y descargar facturas
- ✅ Historial de pedidos
- ✅ Crear y gestionar comentarios/calificaciones
- ✅ Editar perfil personal

### Administrador (`admin`)
- ✅ Gestión completa de productos (CRUD)
- ✅ Gestión de usuarios
- ✅ Gestión de pedidos y estados
- ✅ Moderación de comentarios
- ✅ Acceso a reportes y estadísticas
- ✅ Vista general del sistema

---

## 📊 Características Principales

- **Sistema de Roles**: Cliente y Administrador
- **E-commerce Completo**: Carrito, checkout, pagos con Stripe
- **Gestión de Productos**: CRUD completo con imágenes
- **Sistema de Comentarios**: Calificaciones y reseñas
- **Facturación**: Generación de facturas PDF
- **Reportes**: Dashboard con métricas y estadísticas
- **Autenticación**: Sistema completo con verificación de email
- **Responsive**: Interfaz adaptable con React y Tailwind CSS

---

## 🛠️ Stack Tecnológico

- **Backend**: Laravel 11
- **Frontend**: React + Inertia.js
- **Estilos**: Tailwind CSS
- **Base de Datos**: MySQL
- **Pagos**: Stripe
- **PDFs**: DomPDF

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
