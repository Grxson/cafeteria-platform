<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CarritoController extends Controller
{
    /**
     * Mostrar el carrito del usuario
     */
    public function index()
    {
        $user = Auth::user();

        // Obtener o crear el carrito del usuario
        $carrito = Carrito::firstOrCreate(
            ['user_id' => $user->id],
            ['total' => 0]
        );

        // Cargar productos del carrito con información detallada
        $carritoProductos = CarritoProducto::with('producto.categoriaProducto')
            ->where('carrito_id', $carrito->id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'producto_id' => $item->producto_id,
                    'cantidad' => $item->cantidad,
                    'precio_unitario' => $item->precio_unitario,
                    'subtotal' => $item->cantidad * $item->precio_unitario,
                    'producto' => [
                        'id' => $item->producto->id,
                        'nombre' => $item->producto->nombre,
                        'descripcion' => $item->producto->descripcion,
                        'precio' => $item->producto->precio,
                        'imagen_principal' => $item->producto->imagen_principal,
                        'stock' => $item->producto->stock,
                        'categoria' => $item->producto->categoriaProducto->nombre ?? 'Sin categoría'
                    ]
                ];
            });

        $total = $carritoProductos->sum('subtotal');

        return Inertia::render('Clientes/Carrito', [
            'carrito' => [
                'id' => $carrito->id,
                'productos' => $carritoProductos,
                'total' => $total,
                'cantidad_productos' => $carritoProductos->sum('cantidad')
            ]
        ]);
    }

    /**
     * Agregar producto al carrito
     */
    public function agregar(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $producto = Producto::findOrFail($request->producto_id);

        // Verificar stock disponible
        if ($request->cantidad > $producto->stock) {
            return response()->json([
                'success' => false,
                'message' => '¡Oops! Solo tenemos ' . $producto->stock . ' unidades disponibles de "' . $producto->nombre . '"'
            ], 400);
        }

        // Obtener o crear el carrito del usuario
        $carrito = Carrito::firstOrCreate(
            ['user_id' => $user->id],
            ['total' => 0]
        );

        // Verificar si el producto ya está en el carrito
        $carritoProducto = CarritoProducto::where('carrito_id', $carrito->id)
            ->where('producto_id', $request->producto_id)
            ->first();

        if ($carritoProducto) {
            // Actualizar cantidad si ya existe
            $nuevaCantidad = $carritoProducto->cantidad + $request->cantidad;

            if ($nuevaCantidad > $producto->stock) {
                return response()->json([
                    'success' => false,
                    'message' => '¡Límite alcanzado! Solo puedes agregar ' . ($producto->stock - $carritoProducto->cantidad) . ' unidades más de "' . $producto->nombre . '"'
                ], 400);
            }

            $carritoProducto->update([
                'cantidad' => $nuevaCantidad
            ]);
        } else {
            // Crear nueva entrada en el carrito
            CarritoProducto::create([
                'carrito_id' => $carrito->id,
                'producto_id' => $request->producto_id,
                'cantidad' => $request->cantidad,
                'precio_unitario' => $producto->precio
            ]);
        }

        // Actualizar total del carrito
        $this->actualizarTotalCarrito($carrito);

        return response()->json([
            'success' => true,
            'message' => '¡Genial! ' . $request->cantidad . ' ' . ($request->cantidad == 1 ? 'unidad' : 'unidades') . ' de "' . $producto->nombre . '" agregadas a tu carrito ☕',
            'carrito_count' => $this->getCarritoCount()
        ]);
    }

    /**
     * Obtener solo el contador de productos en el carrito (para API)
     */
    public function count()
    {
        return response()->json([
            'count' => $this->getCarritoCount()
        ]);
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     */
    public function actualizar(Request $request, $carritoProductoId)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $carritoProducto = CarritoProducto::whereHas('carrito', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($carritoProductoId);

        $producto = $carritoProducto->producto;

        // Verificar stock disponible
        if ($request->cantidad > $producto->stock) {
            return response()->json([
                'success' => false,
                'message' => '¡Límite de stock! Solo tenemos ' . $producto->stock . ' unidades de "' . $producto->nombre . '" disponibles'
            ], 400);
        }

        $carritoProducto->update([
            'cantidad' => $request->cantidad
        ]);

        // Actualizar total del carrito
        $this->actualizarTotalCarrito($carritoProducto->carrito);

        return response()->json([
            'success' => true,
            'message' => '✓ Cantidad actualizada: ' . $request->cantidad . ' ' . ($request->cantidad == 1 ? 'unidad' : 'unidades') . ' de "' . $producto->nombre . '"',
            'carrito_count' => $this->getCarritoCount()
        ]);
    }

    /**
     * Quitar producto del carrito
     */
    public function quitar($carritoProductoId)
    {
        $user = Auth::user();
        $carritoProducto = CarritoProducto::with('producto')->whereHas('carrito', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($carritoProductoId);

        $carrito = $carritoProducto->carrito;
        $productoNombre = $carritoProducto->producto->nombre;
        $carritoProducto->delete();

        // Actualizar total del carrito
        $this->actualizarTotalCarrito($carrito);

        return response()->json([
            'success' => true,
            'message' => '🗑️ "' . $productoNombre . '" eliminado de tu carrito',
            'carrito_count' => $this->getCarritoCount()
        ]);
    }

    /**
     * Vaciar carrito completamente
     */
    public function vaciar()
    {
        $user = Auth::user();
        $carrito = Carrito::where('user_id', $user->id)->first();

        if ($carrito) {
            CarritoProducto::where('carrito_id', $carrito->id)->delete();
            $carrito->update(['total' => 0]);
        }

        return response()->json([
            'success' => true,
            'message' => '🧹 ¡Carrito vaciado! Listo para nuevas compras',
            'carrito_count' => 0
        ]);
    }

    /**
     * Función auxiliar para obtener cantidad total de productos en carrito
     */
    private function getCarritoCount()
    {
        $user = Auth::user();
        if (!$user || $user->rol !== 'cliente') {
            return 0;
        }

        // Obtener el conteo directamente con una consulta optimizada
        return CarritoProducto::whereHas('carrito', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->sum('cantidad');
    }

    /**
     * Función auxiliar para actualizar el total del carrito
     */
    private function actualizarTotalCarrito($carrito)
    {
        // Usar SQL raw para cálculo directo en base de datos
        $total = CarritoProducto::where('carrito_id', $carrito->id)
            ->selectRaw('SUM(cantidad * precio_unitario) as total')
            ->value('total') ?? 0;

        $carrito->update(['total' => $total]);
    }
}
