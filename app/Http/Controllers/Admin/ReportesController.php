<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportesController extends Controller
{
    /**
     * Display the reports index page.
     */
    public function index()
    {
        return Inertia::render('Admin/Reportes/Index');
    }

    /**
     * Load DataTable data for products report.
     */
    public function cargarDT(Request $request)
    {
        try {
            \Log::info('DataTable request received', $request->all());
            
            // Parámetros de DataTable
            $draw = $request->get('draw', 1);
            $start = $request->get('start', 0);
            $length = $request->get('length', 10);
            $searchValue = $request->get('search')['value'] ?? '';
            $orderColumn = $request->get('order')[0]['column'] ?? 0;
            $orderDir = $request->get('order')[0]['dir'] ?? 'asc';
            
            \Log::info('Parameters extracted', compact('draw', 'start', 'length', 'searchValue', 'orderColumn', 'orderDir'));
        
        // Mapeo de columnas para ordenamiento
        $columns = [
            0 => 'id',
            1 => 'nombre', 
            2 => 'precio',
            3 => 'stock',
            4 => 'estado',
            5 => 'created_at'
        ];
        
        $orderColumnName = $columns[$orderColumn] ?? 'id';
        
        // Query base con relaciones
        $query = Producto::with(['categoriaProducto'])
            ->select(['id', 'nombre', 'descripcion', 'precio', 'stock', 'estado', 'categoria_producto_id', 'imagen_principal', 'created_at'])
            ->where('estado', '!=', 'eliminado');
        
        // Aplicar búsqueda si existe
        if (!empty($searchValue)) {
            $query->where(function ($q) use ($searchValue) {
                $q->where('nombre', 'like', "%{$searchValue}%")
                  ->orWhere('descripcion', 'like', "%{$searchValue}%")
                  ->orWhere('precio', 'like', "%{$searchValue}%")
                  ->orWhere('stock', 'like', "%{$searchValue}%")
                  ->orWhere('estado', 'like', "%{$searchValue}%")
                  ->orWhereHas('categoriaProducto', function ($q) use ($searchValue) {
                      $q->where('nombre', 'like', "%{$searchValue}%");
                  });
            });
        }
        
        // Contar registros totales y filtrados
        $totalRecords = Producto::where('estado', '!=', 'eliminado')->count();
        $filteredRecords = $query->count();
        
        // Aplicar ordenamiento y paginación
        $productos = $query->orderBy($orderColumnName, $orderDir)
            ->skip($start)
            ->take($length)
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'descripcion' => $producto->descripcion,
                    'precio' => number_format((float)$producto->precio, 2),
                    'stock' => $producto->stock,
                    'estado' => $producto->estado,
                    'categoria' => $producto->categoriaProducto->nombre ?? 'Sin categoría',
                    'imagen_principal' => $producto->imagen_principal,
                    'fecha_creacion' => $producto->created_at->format('d/m/Y H:i'),
                    'acciones' => $producto->id // Para botones de acción
                ];
            })
            ->toArray(); // Convertir a array
        
        $response = [
            'draw' => intval($draw),
            'recordsTotal' => $totalRecords,
            'recordsFiltered' => $filteredRecords,
            'data' => $productos
        ];
        
        \Log::info('Response being sent', $response);
        
        return response()->json($response);
        
        } catch (\Exception $e) {
            \Log::error('Error in cargarDT: ' . $e->getMessage());
            return response()->json(['error' => 'Error loading data'], 500);
        }
    }

    /**
     * Get dashboard statistics for DataTable.
     */
    public function estadisticas()
    {
        $valorInventario = Producto::where('estado', '!=', 'eliminado')
            ->sum(\DB::raw('CAST(precio AS DECIMAL(10,2)) * CAST(stock AS DECIMAL(10,2))'));
            
        $stats = [
            'total_productos' => Producto::where('estado', '!=', 'eliminado')->count(),
            'productos_activos' => Producto::where('estado', 'activo')->count(),
            'productos_inactivos' => Producto::where('estado', 'inactivo')->count(),
            'stock_total' => (int) Producto::where('estado', '!=', 'eliminado')->sum('stock'),
            'valor_inventario' => (float) ($valorInventario ?: 0)
        ];
        
        return response()->json($stats);
    }
}