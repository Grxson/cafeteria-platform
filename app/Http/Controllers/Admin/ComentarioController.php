<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ComentarioCalificacion;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Comentarios/Index');
    }

    /**
     * Load data for DataTable with server-side processing.
     */
    public function cargarDT(Request $request)
    {
        try {
            \Log::info('ComentarioController DataTable request', $request->all());
            
            // Parámetros de DataTable
            $draw = $request->get('draw', 1);
            $start = $request->get('start', 0);
            $length = $request->get('length', 10);
            $searchValue = $request->get('search')['value'] ?? '';
            $orderColumn = $request->get('order')[0]['column'] ?? 0;
            $orderDir = $request->get('order')[0]['dir'] ?? 'asc';
            $estadoFilter = $request->get('estado', '');
            $tipoFilter = $request->get('tipo', '');
            
            // Mapeo de columnas para ordenamiento
            $columns = [
                0 => 'id',
                1 => 'user_id', 
                2 => 'producto_id',
                3 => 'calificacion',
                4 => 'estado',
                5 => 'created_at'
            ];
            
            $orderColumnName = $columns[$orderColumn] ?? 'id';
            
            // Query base con relaciones
            $query = ComentarioCalificacion::with([
                'user:id,name,email', 
                'producto:id,nombre',
                'pedido:id,total'
            ])
            ->select(['id', 'user_id', 'producto_id', 'pedido_id', 'comentario', 'calificacion', 'estado', 'created_at', 'updated_at']);
            
            // Aplicar filtros
            if (!empty($estadoFilter)) {
                $query->where('estado', $estadoFilter);
            }
            
            if (!empty($tipoFilter)) {
                if ($tipoFilter === 'con_pedido') {
                    $query->whereNotNull('pedido_id');
                } elseif ($tipoFilter === 'libre') {
                    $query->whereNull('pedido_id');
                }
            }
            
            // Aplicar búsqueda si existe
            if (!empty($searchValue)) {
                $query->where(function($q) use ($searchValue) {
                    $q->where('comentario', 'like', "%{$searchValue}%")
                      ->orWhere('calificacion', 'like', "%{$searchValue}%")
                      ->orWhereHas('user', function($userQuery) use ($searchValue) {
                          $userQuery->where('name', 'like', "%{$searchValue}%")
                                   ->orWhere('email', 'like', "%{$searchValue}%");
                      })
                      ->orWhereHas('producto', function($productoQuery) use ($searchValue) {
                          $productoQuery->where('nombre', 'like', "%{$searchValue}%");
                      });
                });
            }
            
            // Aplicar ordenamiento
            $query->orderBy($orderColumnName, $orderDir);
            
            // Contar total de registros
            $totalRecords = ComentarioCalificacion::count();
            
            // Contar registros filtrados
            $filteredRecords = $query->count();
            
            // Aplicar paginación
            $comentarios = $query->skip($start)->take($length)->get();
            
            // Formatear datos para DataTable
            $comentarios->transform(function($comentario) {
                return [
                    'id' => $comentario->id,
                    'usuario' => [
                        'name' => $comentario->user->name,
                        'email' => $comentario->user->email,
                    ],
                    'producto' => [
                        'id' => $comentario->producto->id,
                        'nombre' => $comentario->producto->nombre,
                    ],
                    'comentario' => $comentario->comentario,
                    'calificacion' => $comentario->calificacion,
                    'estado' => $comentario->estado,
                    'tipo' => $comentario->pedido_id ? 'Con Pedido' : 'Libre',
                    'pedido_id' => $comentario->pedido_id,
                    'created_at' => $comentario->created_at->format('d/m/Y H:i'),
                    'updated_at' => $comentario->updated_at->format('d/m/Y H:i'),
                ];
            });
            
            $response = [
                'draw' => intval($draw),
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'data' => $comentarios
            ];
            
            \Log::info('ComentarioController response', $response);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            \Log::error('Error in ComentarioController cargarDT: ' . $e->getMessage());
            return response()->json(['error' => 'Error loading data'], 500);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show(ComentarioCalificacion $comentario)
    {
        $comentario->load([
            'user:id,name,email,created_at',
            'producto:id,nombre,precio,imagen_principal',
            'pedido:id,total,estado,created_at'
        ]);

        return Inertia::render('Admin/Comentarios/Show', [
            'comentario' => $comentario
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ComentarioCalificacion $comentario)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,aprobado,rechazado',
            'comentario' => 'nullable|string|max:1000',
        ]);

        try {
            $estadoAnterior = $comentario->estado;
            
            $comentario->estado = $request->estado;
            if ($request->has('comentario')) {
                $comentario->comentario = $request->comentario;
            }
            $comentario->save();

            // Log del cambio de estado
            \Log::info("Comentario #{$comentario->id} cambió de estado: {$estadoAnterior} -> {$request->estado}");

            return redirect()->route('admin.comentarios.show', $comentario)
                ->with('success', 'Comentario actualizado correctamente.');

        } catch (\Exception $e) {
            \Log::error('Error updating comentario: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al actualizar el comentario.');
        }
    }

    /**
     * Update comment status only.
     */
    public function updateStatus(Request $request, ComentarioCalificacion $comentario)
    {
        $request->validate([
            'estado' => 'required|string|in:pendiente,aprobado,rechazado',
        ]);

        try {
            $estadoAnterior = $comentario->estado;
            $comentario->estado = $request->estado;
            $comentario->save();

            \Log::info("Comentario #{$comentario->id} cambió de estado: {$estadoAnterior} -> {$request->estado}");

            return response()->json([
                'success' => true,
                'message' => "Estado del comentario actualizado a: " . ucfirst($request->estado),
                'estado' => $request->estado
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating comentario status: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar el estado del comentario.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ComentarioCalificacion $comentario)
    {
        try {
            $comentario->delete();

            \Log::info("Comentario #{$comentario->id} eliminado");

            return response()->json([
                'success' => true,
                'message' => 'Comentario eliminado correctamente.'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error deleting comentario: ' . $e->getMessage());
            return response()->json(['error' => 'Error al eliminar el comentario.'], 500);
        }
    }

    /**
     * Get comment statistics for dashboard.
     */
    public function estadisticas()
    {
        $stats = [
            'total_comentarios' => ComentarioCalificacion::count(),
            'comentarios_pendientes' => ComentarioCalificacion::where('estado', 'pendiente')->count(),
            'comentarios_aprobados' => ComentarioCalificacion::where('estado', 'aprobado')->count(),
            'comentarios_rechazados' => ComentarioCalificacion::where('estado', 'rechazado')->count(),
            'comentarios_con_pedido' => ComentarioCalificacion::whereNotNull('pedido_id')->count(),
            'comentarios_libres' => ComentarioCalificacion::whereNull('pedido_id')->count(),
            'calificacion_promedio' => ComentarioCalificacion::where('estado', 'aprobado')
                ->whereNotNull('calificacion')
                ->avg('calificacion'),
            'comentarios_mes' => ComentarioCalificacion::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'comentarios_hoy' => ComentarioCalificacion::whereDate('created_at', today())->count(),
        ];
        
        return response()->json($stats);
    }

    /**
     * Get comments by status.
     */
    public function porEstado($estado)
    {
        $comentarios = ComentarioCalificacion::with(['user:id,name,email', 'producto:id,nombre'])
            ->where('estado', $estado)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Comentarios/Index', [
            'comentarios' => $comentarios,
            'estadoFiltro' => $estado
        ]);
    }

    /**
     * Bulk update comments status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'comentario_ids' => 'required|array',
            'comentario_ids.*' => 'exists:comentarios_calificaciones,id',
            'estado' => 'required|string|in:pendiente,aprobado,rechazado',
        ]);

        try {
            $count = ComentarioCalificacion::whereIn('id', $request->comentario_ids)
                ->update(['estado' => $request->estado]);

            \Log::info("Actualizados {$count} comentarios al estado: {$request->estado}");

            return response()->json([
                'success' => true,
                'message' => "Se actualizaron {$count} comentarios correctamente.",
                'count' => $count
            ]);

        } catch (\Exception $e) {
            \Log::error('Error bulk updating comentarios: ' . $e->getMessage());
            return response()->json(['error' => 'Error al actualizar los comentarios.'], 500);
        }
    }
}