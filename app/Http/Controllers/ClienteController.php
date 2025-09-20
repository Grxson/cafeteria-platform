<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClienteRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClienteController extends Controller
{
    /**
     * Show the form for creating a new client registration.
     */
    public function create()
    {
        return Inertia::render('Clientes/Create');
    }

    /**
     * Store a newly created client in storage.
     */
    public function store(StoreClienteRequest $request)
    {
        try {
            $data = $request->validated();
            
            // Encriptar la contraseña
            $data['password'] = Hash::make($data['password']);
            
            // Asignar rol de cliente automáticamente
            $data['rol'] = 'cliente';
            $data['estado'] = 'activo';
            $data['fecha_registro'] = now();

            // Crear el usuario cliente
            $cliente = User::create($data);

            // Autenticar automáticamente al cliente recién registrado
            Auth::login($cliente);

            return redirect()
                ->route('clientes.dashboard')
                ->with('success', '¡Bienvenido! Tu cuenta ha sido creada exitosamente.');

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->withErrors(['error' => 'Error al crear la cuenta: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the client dashboard.
     */
    public function dashboard()
    {
        $cliente = Auth::user();
        
        return Inertia::render('Clientes/Dashboard', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Show the client store.
     */
    public function tienda()
    {
        $cliente = Auth::user();
        
        // Obtener productos disponibles con sus categorías
        $productos = \App\Models\Producto::with('categoriaProducto')
            ->where('estado', 'activo')
            ->orderBy('categoria_producto_id')
            ->orderBy('nombre')
            ->get();
            
        $categorias = \App\Models\CategoriaProducto::orderBy('nombre')->get();
        
        return Inertia::render('Clientes/Tienda', [
            'cliente' => $cliente,
            'productos' => $productos,
            'categorias' => $categorias
        ]);
    }

    /**
     * Show the client profile.
     */
    public function profile()
    {
        $cliente = Auth::user();
        
        return view('clientes.profile', compact('cliente'));
    }

    /**
     * Show the client orders.
     */
    public function orders()
    {
        $cliente = Auth::user();
        $pedidos = $cliente->pedidos()
            ->with('detalles.producto')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return view('clientes.orders', compact('cliente', 'pedidos'));
    }

    /**
     * Show product details.
     */
    public function mostrarProducto(\App\Models\Producto $producto)
    {
        $cliente = Auth::user();
        
        // Cargar las relaciones necesarias
        $producto->load(['categoriaProducto', 'comentarios.user']);
        
        // Obtener estadísticas de comentarios
        $comentariosActivos = $producto->comentarios()->where('estado', 'activo');
        $totalComentarios = $comentariosActivos->count();
        $promedioCalificacion = $totalComentarios > 0 ? $comentariosActivos->avg('calificacion') : 0;
        
        // Distribución de calificaciones
        $distribucionCalificaciones = [];
        for ($i = 1; $i <= 5; $i++) {
            $count = $comentariosActivos->where('calificacion', $i)->count();
            $distribucionCalificaciones[$i] = [
                'count' => $count,
                'percentage' => $totalComentarios > 0 ? round(($count / $totalComentarios) * 100, 1) : 0
            ];
        }
        
        // Verificar si el usuario puede comentar este producto
        $puedeComentarInfo = $this->verificarPuedeComentarProducto($cliente, $producto->id);
        
        // Obtener productos relacionados de la misma categoría
        $productosRelacionados = \App\Models\Producto::with('categoriaProducto')
            ->where('categoria_producto_id', $producto->categoria_producto_id)
            ->where('id', '!=', $producto->id)
            ->where('estado', 'activo')
            ->limit(4)
            ->get();
        
        return Inertia::render('Clientes/ProductoDetalle', [
            'cliente' => $cliente,
            'producto' => $producto,
            'productosRelacionados' => $productosRelacionados,
            'estadisticasComentarios' => [
                'total_comentarios' => $totalComentarios,
                'promedio_calificacion' => round($promedioCalificacion, 1),
                'distribucion_calificaciones' => $distribucionCalificaciones
            ],
            'puedeComentarInfo' => $puedeComentarInfo
        ]);
    }
    
    /**
     * Verificar si el usuario puede comentar un producto.
     */
    private function verificarPuedeComentarProducto($user, $productoId)
    {
        // Buscar pedidos completados del usuario que contengan este producto
        $pedidosConProducto = \App\Models\Pedido::where('user_id', $user->id)
                                   ->where('estado', 'completado')
                                   ->whereHas('detalles', function($query) use ($productoId) {
                                       $query->where('producto_id', $productoId);
                                   })
                                   ->get();

        $pedidosDisponibles = [];
        foreach ($pedidosConProducto as $pedido) {
            // Verificar si ya comentó este producto en este pedido
            $yaComento = \App\Models\ComentarioCalificacion::where([
                'user_id' => $user->id,
                'producto_id' => $productoId,
                'pedido_id' => $pedido->id,
            ])->exists();

            if (!$yaComento) {
                $pedidosDisponibles[] = [
                    'id' => $pedido->id,
                    'fecha' => $pedido->created_at->format('d/m/Y'),
                    'total' => $pedido->total
                ];
            }
        }

        return [
            'puede_comentar' => count($pedidosDisponibles) > 0,
            'pedidos_disponibles' => $pedidosDisponibles
        ];
    }
}
