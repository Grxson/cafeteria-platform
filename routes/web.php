<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ProductoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\CarritoController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas de registro de clientes (públicas)
Route::get('/registro', [ClienteController::class, 'create'])->name('clientes.create');
Route::post('/registro', [ClienteController::class, 'store'])->name('clientes.store');

// Rutas para clientes autenticados
Route::middleware(['auth', 'verified', 'client'])->prefix('cliente')->name('clientes.')->group(function () {
    Route::get('/dashboard', [ClienteController::class, 'dashboard'])->name('dashboard');
    Route::get('/tienda', [ClienteController::class, 'tienda'])->name('tienda');
    Route::get('/producto/{producto}', [ClienteController::class, 'mostrarProducto'])->name('producto.show');

    // Rutas para comentarios y calificaciones
    Route::post('/comentarios', [ComentarioController::class, 'store'])->name('comentarios.store');
    Route::get('/producto/{producto}/comentarios', [ComentarioController::class, 'getComentarios'])->name('comentarios.get');
    Route::get('/producto/{producto}/estadisticas', [ComentarioController::class, 'getEstadisticas'])->name('comentarios.estadisticas');
    Route::get('/producto/{producto}/puede-comentar', [ComentarioController::class, 'puedeComentarProducto'])->name('comentarios.puede-comentar');

    // Rutas para carrito de compras
    Route::get('/carrito', [CarritoController::class, 'index'])->name('carrito');
    Route::post('/carrito/agregar', [CarritoController::class, 'agregar'])->name('carrito.agregar');
    Route::put('/carrito/actualizar/{carritoProducto}', [CarritoController::class, 'actualizar'])->name('carrito.actualizar');
    Route::delete('/carrito/quitar/{carritoProducto}', [CarritoController::class, 'quitar'])->name('carrito.quitar');
    Route::delete('/carrito/vaciar', [CarritoController::class, 'vaciar'])->name('carrito.vaciar');
    Route::get('/carrito/count', [CarritoController::class, 'count'])->name('carrito.count');
});

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
