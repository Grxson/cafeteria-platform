<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Usuarios/Index');
    }

    /**
     * Load data for DataTable with server-side processing.
     */
    public function cargarDT(Request $request)
    {
        try {
            \Log::info('UsuarioController DataTable request', [
                'user_id' => auth()->id(),
                'user_rol' => auth()->user()?->rol,
                'request_data' => $request->all()
            ]);
            
            // Parámetros de DataTable
            $draw = $request->get('draw', 1);
            $start = $request->get('start', 0);
            $length = $request->get('length', 10);
            $searchValue = $request->get('search')['value'] ?? '';
            $orderColumn = $request->get('order')[0]['column'] ?? 0;
            $orderDir = $request->get('order')[0]['dir'] ?? 'asc';
            
            // Mapeo de columnas para ordenamiento
            $columns = [
                0 => 'id',
                1 => 'name', 
                2 => 'email',
                3 => 'rol',
                4 => 'created_at',
                5 => 'email_verified_at'
            ];
            
            $orderColumnName = $columns[$orderColumn] ?? 'id';
            
            // Query base
            $query = User::select(['id', 'name', 'email', 'rol', 'created_at', 'email_verified_at'])
                ->where('rol', 'cliente'); // Solo mostrar clientes
            
            // Aplicar búsqueda si existe
            if (!empty($searchValue)) {
                $query->where(function($q) use ($searchValue) {
                    $q->where('name', 'like', "%{$searchValue}%")
                      ->orWhere('email', 'like', "%{$searchValue}%");
                });
            }
            
            // Aplicar ordenamiento
            $query->orderBy($orderColumnName, $orderDir);
            
            // Contar total de registros
            $totalRecords = User::where('rol', 'cliente')->count();
            
            // Contar registros filtrados
            $filteredRecords = $query->count();
            
            // Aplicar paginación
            $usuarios = $query->skip($start)->take($length)->get();
            
            // Formatear datos para DataTable
            $usuarios->transform(function($usuario) {
                return [
                    'id' => $usuario->id,
                    'name' => $usuario->name,
                    'email' => $usuario->email,
                    'rol' => ucfirst($usuario->rol),
                    'created_at' => $usuario->created_at->format('d/m/Y H:i'),
                    'email_verified_at' => $usuario->email_verified_at ? $usuario->email_verified_at->format('d/m/Y H:i') : 'No verificado',
                    'total_pedidos' => $usuario->pedidos()->count(),
                    'ultimo_pedido' => $usuario->pedidos()->latest()->first()?->created_at->format('d/m/Y') ?? 'Nunca',
                ];
            });
            
            $response = [
                'draw' => intval($draw),
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'data' => $usuarios
            ];
            
            \Log::info('UsuarioController response', $response);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            \Log::error('Error in UsuarioController cargarDT: ' . $e->getMessage());
            return response()->json(['error' => 'Error loading data'], 500);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show(User $usuario)
    {
        // Verificar que sea un cliente
        if ($usuario->rol !== 'cliente') {
            abort(404);
        }

        $usuario->load(['pedidos' => function($query) {
            $query->with(['detalles.producto', 'cupones'])
                  ->orderBy('created_at', 'desc');
        }]);

        // Estadísticas del usuario
        $estadisticas = [
            'total_pedidos' => $usuario->pedidos()->count(),
            'pedidos_pendientes' => $usuario->pedidos()->where('estado', 'pendiente')->count(),
            'pedidos_pagados' => $usuario->pedidos()->where('estado', 'pagado')->count(),
            'pedidos_enviados' => $usuario->pedidos()->where('estado', 'enviado')->count(),
            'pedidos_completados' => $usuario->pedidos()->where('estado', 'completado')->count(),
            'total_gastado' => $usuario->pedidos()->sum('total'),
            'fecha_ultimo_pedido' => $usuario->pedidos()->latest()->first()?->created_at,
            'fecha_registro' => $usuario->created_at,
        ];

        return Inertia::render('Admin/Usuarios/Show', [
            'usuario' => $usuario,
            'estadisticas' => $estadisticas
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $usuario)
    {
        // Verificar que sea un cliente
        if ($usuario->rol !== 'cliente') {
            abort(404);
        }

        return Inertia::render('Admin/Usuarios/Edit', [
            'usuario' => $usuario
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario)
    {
        // Verificar que sea un cliente
        if ($usuario->rol !== 'cliente') {
            abort(404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $usuario->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            $usuario->name = $request->name;
            $usuario->email = $request->email;
            
            if ($request->filled('password')) {
                $usuario->password = Hash::make($request->password);
            }
            
            $usuario->save();

            return redirect()->route('admin.usuarios.show', $usuario)
                ->with('success', 'Usuario actualizado correctamente.');

        } catch (\Exception $e) {
            \Log::error('Error updating usuario: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al actualizar el usuario.');
        }
    }

    /**
     * Toggle user status (activate/deactivate).
     */
    public function toggleStatus(User $usuario)
    {
        // Verificar que sea un cliente
        if ($usuario->rol !== 'cliente') {
            abort(404);
        }

        try {
            $usuario->email_verified_at = $usuario->email_verified_at ? null : now();
            $usuario->save();

            $status = $usuario->email_verified_at ? 'activado' : 'desactivado';
            
            return response()->json([
                'success' => true,
                'message' => "Usuario {$status} correctamente.",
                'status' => $usuario->email_verified_at ? 'activo' : 'inactivo'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error toggling usuario status: ' . $e->getMessage());
            return response()->json(['error' => 'Error al cambiar el estado del usuario.'], 500);
        }
    }

    /**
     * Get user statistics for dashboard.
     */
    public function estadisticas()
    {
        $stats = [
            'total_usuarios' => User::where('rol', 'cliente')->count(),
            'usuarios_activos' => User::where('rol', 'cliente')->whereNotNull('email_verified_at')->count(),
            'usuarios_inactivos' => User::where('rol', 'cliente')->whereNull('email_verified_at')->count(),
            'nuevos_usuarios_mes' => User::where('rol', 'cliente')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'usuarios_con_pedidos' => User::where('rol', 'cliente')
                ->whereHas('pedidos')
                ->count(),
        ];
        
        return response()->json($stats);
    }
}