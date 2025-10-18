<?php

namespace App\Http\Controllers;

use App\Models\ComentarioCalificacion;
use App\Models\Producto;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ComentarioController extends Controller
{
    /**
     * Store a newly created comment and rating.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id',
            'pedido_id' => 'required|exists:pedidos,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Verificar que el usuario haya comprado el producto en el pedido especificado
        $pedido = Pedido::where('id', $request->pedido_id)
                        ->where('user_id', $user->id)
                        ->where('estado', 'completado')
                        ->first();

        if (!$pedido) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes comentar este producto. El pedido debe estar completado.'
            ], 403);
        }

        // Verificar que el producto esté en el pedido
        $tieneProducto = $pedido->detalles()
                               ->where('producto_id', $request->producto_id)
                               ->exists();

        if (!$tieneProducto) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes comentar este producto. No lo has comprado en este pedido.'
            ], 403);
        }

        // Verificar que no exista ya un comentario para este producto/pedido/usuario
        $existeComentario = ComentarioCalificacion::where([
            'user_id' => $user->id,
            'producto_id' => $request->producto_id,
            'pedido_id' => $request->pedido_id,
        ])->exists();

        if ($existeComentario) {
            return response()->json([
                'success' => false,
                'message' => 'Ya has comentado este producto para este pedido.'
            ], 409);
        }

        try {
            $comentario = ComentarioCalificacion::create([
                'user_id' => $user->id,
                'producto_id' => $request->producto_id,
                'pedido_id' => $request->pedido_id,
                'calificacion' => $request->calificacion,
                'comentario' => $request->comentario,
                'estado' => 'activo',
            ]);

            // Cargar las relaciones para la respuesta
            $comentario->load('user');

            return response()->json([
                'success' => true,
                'message' => '¡Gracias por tu comentario! Ha sido publicado exitosamente.',
                'comentario' => $comentario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el comentario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get comments for a specific product.
     */
    public function getComentarios($productoId)
    {
        $comentarios = ComentarioCalificacion::with('user')
                                           ->where('producto_id', $productoId)
                                           ->where('estado', 'activo')
                                           ->orderBy('created_at', 'desc')
                                           ->get();

        return response()->json([
            'success' => true,
            'comentarios' => $comentarios
        ]);
    }

    /**
     * Get rating statistics for a product.
     */
    public function getEstadisticas($productoId)
    {
        $comentarios = ComentarioCalificacion::where('producto_id', $productoId)
                                           ->where('estado', 'activo');

        $totalComentarios = $comentarios->count();
        $promedioCalificacion = $totalComentarios > 0 ? $comentarios->avg('calificacion') : 0;

        $distribucionCalificaciones = [];
        for ($i = 1; $i <= 5; $i++) {
            $count = ComentarioCalificacion::where('producto_id', $productoId)
                                          ->where('estado', 'activo')
                                          ->where('calificacion', $i)
                                          ->count();
            $distribucionCalificaciones[$i] = [
                'count' => $count,
                'percentage' => $totalComentarios > 0 ? round(($count / $totalComentarios) * 100, 1) : 0
            ];
        }

        return response()->json([
            'success' => true,
            'total_comentarios' => $totalComentarios,
            'promedio_calificacion' => round($promedioCalificacion, 1),
            'distribucion_calificaciones' => $distribucionCalificaciones
        ]);
    }

    /**
     * Check if user can comment on a product.
     */
    public function puedeComentarProducto($productoId)
    {
        $user = Auth::user();
        
        // Buscar pedidos completados del usuario que contengan este producto
        $pedidosConProducto = Pedido::where('user_id', $user->id)
                                   ->where('estado', 'completado')
                                   ->whereHas('detalles', function($query) use ($productoId) {
                                       $query->where('producto_id', $productoId);
                                   })
                                   ->get();

        $pedidosDisponibles = [];
        foreach ($pedidosConProducto as $pedido) {
            // Verificar si ya comentó este producto en este pedido
            $yaComento = ComentarioCalificacion::where([
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

        return response()->json([
            'success' => true,
            'puede_comentar' => count($pedidosDisponibles) > 0,
            'pedidos_disponibles' => $pedidosDisponibles
        ]);
    }

    /**
     * Store a comment without requiring a purchase (libre).
     */
    public function storeLibre(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'producto_id' => 'required|exists:productos,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Auth::user();
        
        // Verificar que no exista ya un comentario libre para este producto/usuario
        $existeComentario = ComentarioCalificacion::where([
            'user_id' => $user->id,
            'producto_id' => $request->producto_id,
            'pedido_id' => null, // Comentarios libres no tienen pedido_id
        ])->exists();

        if ($existeComentario) {
            return response()->json([
                'success' => false,
                'message' => 'Ya has comentado este producto anteriormente.'
            ], 409);
        }

        try {
            $comentario = ComentarioCalificacion::create([
                'user_id' => $user->id,
                'producto_id' => $request->producto_id,
                'pedido_id' => null, // Comentarios libres no requieren pedido
                'calificacion' => $request->calificacion,
                'comentario' => $request->comentario,
                'estado' => 'activo',
            ]);

            // Cargar las relaciones para la respuesta
            $comentario->load('user');

            return response()->json([
                'success' => true,
                'message' => '¡Gracias por tu comentario! Ha sido publicado exitosamente.',
                'comentario' => $comentario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el comentario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a comment (only by the owner).
     */
    public function update(Request $request, ComentarioCalificacion $comentario)
    {
        $user = Auth::user();
        
        // Verificar que el usuario sea el propietario del comentario
        if ($comentario->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para editar este comentario.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $comentario->update([
                'calificacion' => $request->calificacion,
                'comentario' => $request->comentario,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comentario actualizado exitosamente.',
                'comentario' => $comentario
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el comentario: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a comment (only by the owner).
     */
    public function destroy(ComentarioCalificacion $comentario)
    {
        $user = Auth::user();
        
        // Verificar que el usuario sea el propietario del comentario
        if ($comentario->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este comentario.'
            ], 403);
        }

        try {
            $comentario->delete();

            return response()->json([
                'success' => true,
                'message' => 'Comentario eliminado exitosamente.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el comentario: ' . $e->getMessage()
            ], 500);
        }
    }
}
