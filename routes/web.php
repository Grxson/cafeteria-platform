<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ProductoController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Admin\PedidoController;
use App\Http\Controllers\Admin\ComentarioController as AdminComentarioController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\StripeController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal
Route::get('/', [ClienteController::class, 'welcome'])->name('welcome');

// Tienda pública (accesible sin autenticación)
Route::get('/tienda-publica', [ClienteController::class, 'tiendaPublica'])->name('tienda.publica');

// Rutas de registro de clientes (públicas)
Route::get('/registro', [ClienteController::class, 'create'])->name('clientes.create');
Route::post('/registro', [ClienteController::class, 'store'])->name('clientes.store');

// Rutas para clientes autenticados
Route::middleware(['auth', 'verified', 'client'])->prefix('cliente')->name('clientes.')->group(function () {
    Route::get('/dashboard', [ClienteController::class, 'dashboard'])->name('dashboard');
    Route::get('/tienda', [ClienteController::class, 'tienda'])->name('tienda');
    Route::get('/producto/{producto}', [ClienteController::class, 'mostrarProducto'])->name('producto.show');
    Route::get('/pedidos', [ClienteController::class, 'pedidos'])->name('pedidos');

    // Rutas para comentarios y calificaciones
    Route::post('/comentarios', [ComentarioController::class, 'store'])->name('comentarios.store');
    Route::post('/comentarios/libre', [ComentarioController::class, 'storeLibre'])->name('comentarios.store.libre');
    Route::put('/comentarios/{comentario}', [ComentarioController::class, 'update'])->name('comentarios.update');
    Route::delete('/comentarios/{comentario}', [ComentarioController::class, 'destroy'])->name('comentarios.delete');
    Route::get('/producto/{producto}/comentarios', [ComentarioController::class, 'getComentarios'])->name('comentarios.get');
    Route::get('/producto/{producto}/estadisticas', [ComentarioController::class, 'getEstadisticas'])->name('comentarios.estadisticas');
    Route::get('/producto/{producto}/puede-comentar', [ComentarioController::class, 'puedeComentarProducto'])->name('comentarios.puede-comentar');

    // Rutas para carrito de compras
    Route::get('/carrito', [CarritoController::class, 'index'])->name('carrito');
    Route::get('/carrito/checkout-preview', [CarritoController::class, 'checkoutPreview'])->name('carrito.checkout-preview');
    Route::post('/carrito/agregar', [CarritoController::class, 'agregar'])->name('carrito.agregar');
    Route::put('/carrito/actualizar/{carritoProducto}', [CarritoController::class, 'actualizar'])->name('carrito.actualizar');
    Route::delete('/carrito/quitar/{carritoProducto}', [CarritoController::class, 'quitar'])->name('carrito.quitar');
    Route::delete('/carrito/vaciar', [CarritoController::class, 'vaciar'])->name('carrito.vaciar');
    Route::get('/carrito/count', [CarritoController::class, 'count'])->name('carrito.count');
    
    // Ruta para compra directa
    Route::post('/comprar-directo', [CarritoController::class, 'comprarDirecto'])->name('comprar.directo');
    Route::get('/producto/{producto}/checkout-preview', [CarritoController::class, 'productoCheckoutPreview'])->name('producto.checkout-preview');
    
    // Rutas para Stripe
    Route::post('/stripe/checkout-session', [StripeController::class, 'createCheckoutSession'])->name('stripe.checkout');
    Route::post('/stripe/checkout-session-direct', [StripeController::class, 'createDirectCheckoutSession'])->name('stripe.checkout.direct');
    
    // Rutas para facturas
    Route::get('/factura/{pedido}/descargar', [App\Http\Controllers\InvoiceController::class, 'downloadPDF'])->name('factura.download');
    Route::get('/factura/{pedido}/ver', [App\Http\Controllers\InvoiceController::class, 'viewPDF'])->name('factura.view');
});

// Ruta de éxito de Stripe (fuera del grupo para acceso público)
Route::get('/stripe/success', [App\Http\Controllers\StripeController::class, 'handleSuccess'])->name('stripe.success');

// Rutas para administradores
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard de administración
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Gestión de productos
    Route::patch('productos/{producto}/toggle-status', [ProductoController::class, 'toggleStatus'])->name('productos.toggle-status');
    Route::patch('productos/{producto}/deactivate', [ProductoController::class, 'deactivate'])->name('productos.deactivate');
    Route::delete('productos/{producto}/delete', [ProductoController::class, 'delete'])->name('productos.delete');
    Route::post('productos/cargar-dt', [ProductoController::class, 'cargarDT'])->name('productos.cargar-dt');
    Route::resource('productos', ProductoController::class);
    
    // Gestión de usuarios
    Route::patch('usuarios/{usuario}/toggle-status', [UsuarioController::class, 'toggleStatus'])->name('usuarios.toggle-status');
    Route::post('usuarios/cargar-dt', [UsuarioController::class, 'cargarDT'])->name('usuarios.cargar-dt');
    Route::get('usuarios/estadisticas', [UsuarioController::class, 'estadisticas'])->name('usuarios.estadisticas');
    Route::resource('usuarios', UsuarioController::class)->only(['index', 'show', 'edit', 'update']);
    
    // Gestión de pedidos
    Route::patch('pedidos/{pedido}/update-status', [PedidoController::class, 'updateStatus'])->name('pedidos.update-status');
    Route::post('pedidos/cargar-dt', [PedidoController::class, 'cargarDT'])->name('pedidos.cargar-dt');
    Route::get('pedidos/estadisticas', [PedidoController::class, 'estadisticas'])->name('pedidos.estadisticas');
    Route::get('pedidos/estado/{estado}', [PedidoController::class, 'porEstado'])->name('pedidos.por-estado');
    Route::resource('pedidos', PedidoController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);
    
    // Gestión de comentarios
    Route::patch('comentarios/{comentario}/update-status', [AdminComentarioController::class, 'updateStatus'])->name('comentarios.update-status');
    Route::post('comentarios/cargar-dt', [AdminComentarioController::class, 'cargarDT'])->name('comentarios.cargar-dt');
    Route::get('comentarios/estadisticas', [AdminComentarioController::class, 'estadisticas'])->name('comentarios.estadisticas');
    Route::get('comentarios/estado/{estado}', [AdminComentarioController::class, 'porEstado'])->name('comentarios.por-estado');
    Route::post('comentarios/bulk-update-status', [AdminComentarioController::class, 'bulkUpdateStatus'])->name('comentarios.bulk-update-status');
    Route::resource('comentarios', AdminComentarioController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);
    
    // Reportes y DataTable
    Route::get('reportes', [App\Http\Controllers\Admin\ReportesController::class, 'index'])->name('reportes.index');
    Route::post('reportes/cargar-dt', [App\Http\Controllers\Admin\ReportesController::class, 'cargarDT'])->name('reportes.cargar-dt');
    Route::get('reportes/estadisticas', [App\Http\Controllers\Admin\ReportesController::class, 'estadisticas'])->name('reportes.estadisticas');
});

// Rutas de perfil de usuario
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
