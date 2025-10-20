<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Pedidos/Index');
    }

    /**
     * Load data for DataTable with server-side processing.
     */
    public function cargarDT(Request $request)
    {
        try {
            \Log::info('PedidoController DataTable request', $request->all());
            
            // Parámetros de DataTable
            $draw = $request->get('draw', 1);
            $start = $request->get('start', 0);
            $length = $request->get('length', 10);
            $searchValue = $request->get('search')['value'] ?? '';
            $orderColumn = $request->get('order')[0]['column'] ?? 0;
            $orderDir = $request->get('order')[0]['dir'] ?? 'asc';
            $estadoFilter = $request->get('estado', '');
            
            // Mapeo de columnas para ordenamiento
            $columns = [
                0 => 'id',
                1 => 'user_id', 
                2 => 'total',
                3 => 'estado',
                4 => 'created_at',
                5 => 'updated_at'
            ];
            
            $orderColumnName = $columns[$orderColumn] ?? 'id';
            
            // Query base con relaciones
            $query = Pedido::with(['user:id,name,email', 'detalles.producto:id,nombre'])
                ->select(['id', 'user_id', 'total', 'estado', 'direccion_envio', 'id_transaccion_pago', 'created_at', 'updated_at']);
            
            // Aplicar filtro de estado si existe
            if (!empty($estadoFilter)) {
                $query->where('estado', $estadoFilter);
            }
            
            // Aplicar búsqueda si existe
            if (!empty($searchValue)) {
                $query->where(function($q) use ($searchValue) {
                    $q->where('id', 'like', "%{$searchValue}%")
                      ->orWhere('total', 'like', "%{$searchValue}%")
                      ->orWhere('estado', 'like', "%{$searchValue}%")
                      ->orWhereHas('user', function($userQuery) use ($searchValue) {
                          $userQuery->where('name', 'like', "%{$searchValue}%")
                                   ->orWhere('email', 'like', "%{$searchValue}%");
                      });
                });
            }
            
            // Aplicar ordenamiento
            $query->orderBy($orderColumnName, $orderDir);
            
            // Contar total de registros
            $totalRecords = Pedido::count();
            
            // Contar registros filtrados
            $filteredRecords = $query->count();
            
            // Aplicar paginación
            $pedidos = $query->skip($start)->take($length)->get();
            
            // Formatear datos para DataTable
            $pedidos->transform(function($pedido) {
                return [
                    'id' => $pedido->id,
                    'cliente' => [
                        'name' => $pedido->user->name,
                        'email' => $pedido->user->email,
                    ],
                    'total' => $pedido->total,
                    'estado' => $pedido->estado,
                    'direccion_envio' => $pedido->direccion_envio,
                    'id_transaccion_pago' => $pedido->id_transaccion_pago,
                    'created_at' => $pedido->created_at->format('d/m/Y H:i'),
                    'updated_at' => $pedido->updated_at->format('d/m/Y H:i'),
                    'productos_count' => $pedido->detalles->count(),
                    'detalles' => $pedido->detalles->map(function($detalle) {
                        return [
                            'cantidad' => $detalle->cantidad,
                            'precio_unitario' => $detalle->precio_unitario,
                            'producto' => [
                                'nombre' => $detalle->producto->nombre ?? 'Producto no disponible',
                                'imagen_principal' => $detalle->producto->imagen_principal ?? null,
                            ]
                        ];
                    })
                ];
            });
            
            $response = [
                'draw' => intval($draw),
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'data' => $pedidos
            ];
            
            \Log::info('PedidoController response', $response);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            \Log::error('Error in PedidoController cargarDT: ' . $e->getMessage());
            return response()->json(['error' => 'Error loading data'], 500);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show(Pedido $pedido)
    {
        $pedido->load([
            'user:id,name,email,created_at',
            'detalles.producto:id,nombre,precio,imagen_principal',
            'cupones:id,codigo,tipo_descuento,valor_descuento'
        ]);

        // Estadísticas del pedido
        $estadisticas = [
            'total_productos' => $pedido->detalles->sum('cantidad'),
            'subtotal' => $pedido->detalles->sum(function($detalle) {
                return $detalle->cantidad * $detalle->precio_unitario;
            }),
            'descuento_aplicado' => $pedido->cupones->sum(function($cupon) {
                if ($cupon->tipo_descuento === 'porcentaje') {
                    return ($pedido->total * $cupon->valor_descuento) / 100;
                }
                return $cupon->valor_descuento ?? 0;
            }),
            'total_final' => $pedido->total,
        ];

        return Inertia::render('Admin/Pedidos/Show', [
            'pedido' => $pedido,
            'estadisticas' => $estadisticas
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pedido $pedido)
    {
        return Inertia::render('Admin/Pedidos/Edit', [
            'pedido' => $pedido
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pedido $pedido)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,pagado,enviado,completado,cancelado',
            'direccion_envio' => 'nullable|string|max:500',
            'id_transaccion_pago' => 'nullable|string|max:255',
        ]);

        try {
            $estadoAnterior = $pedido->estado;
            
            $pedido->estado = $request->estado;
            $pedido->direccion_envio = $request->direccion_envio;
            $pedido->id_transaccion_pago = $request->id_transaccion_pago;
            $pedido->save();

            // Log del cambio de estado
            \Log::info("Pedido #{$pedido->id} cambió de estado: {$estadoAnterior} -> {$request->estado}");

            return redirect()->route('admin.pedidos.show', $pedido)
                ->with('success', 'Pedido actualizado correctamente.');

        } catch (\Exception $e) {
            \Log::error('Error updating pedido: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al actualizar el pedido.');
        }
    }

    /**
     * Update order status only.
     */
    public function updateStatus(Request $request, Pedido $pedido)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,procesando,enviado,entregado,cancelado',
        ]);

        try {
            $estadoAnterior = $pedido->estado;
            $pedido->estado = $request->estado;
            $pedido->save();

            \Log::info("Pedido #{$pedido->id} cambió de estado: {$estadoAnterior} -> {$request->estado}");

            return response()->json([
                'success' => true,
                'message' => "Estado del pedido actualizado a: " . ucfirst($request->estado),
                'estado' => $request->estado
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating pedido status: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar el estado del pedido.'], 500);
        }
    }

    /**
     * Get order statistics for dashboard.
     */
    public function estadisticas()
    {
        $stats = [
            'total_pedidos' => Pedido::count(),
            'pedidos_pendientes' => Pedido::where('estado', 'pendiente')->count(),
            'pedidos_procesando' => Pedido::where('estado', 'procesando')->count(),
            'pedidos_enviados' => Pedido::where('estado', 'enviado')->count(),
            'pedidos_entregados' => Pedido::where('estado', 'entregado')->count(),
            'pedidos_cancelados' => Pedido::where('estado', 'cancelado')->count(),
            'ventas_totales' => Pedido::where('estado', 'entregado')->sum('total'),
            'ventas_mes' => Pedido::where('estado', 'entregado')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total'),
            'pedidos_hoy' => Pedido::whereDate('created_at', today())->count(),
            'ventas_hoy' => Pedido::where('estado', 'entregado')
                ->whereDate('created_at', today())
                ->sum('total'),
        ];
        
        return response()->json($stats);
    }

    /**
     * Get orders by status.
     */
    public function porEstado($estado)
    {
        $pedidos = Pedido::with(['user:id,name,email'])
            ->where('estado', $estado)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Pedidos/Index', [
            'pedidos' => $pedidos,
            'estadoFiltro' => $estado
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pedido $pedido)
    {
        try {
            \Log::info("Eliminando pedido #{$pedido->id} por administrador");

            // Eliminar detalles del pedido primero
            $pedido->detalles()->delete();
            
            // Eliminar cupones asociados
            $pedido->cupones()->detach();
            
            // Eliminar comentarios asociados
            $pedido->comentarios()->delete();
            
            // Eliminar el pedido
            $pedido->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pedido eliminado correctamente'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error eliminando pedido: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el pedido'
            ], 500);
        }
    }
}