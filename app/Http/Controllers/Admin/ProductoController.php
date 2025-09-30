<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Models\Producto;
use App\Models\CategoriaProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Productos/Index');
    }

    /**
     * Load data for DataTable with server-side processing.
     */
    public function cargarDT(Request $request)
    {
        try {
            \Log::info('ProductoController DataTable request', $request->all());
            
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
                ->toArray();

            $response = [
                'draw' => intval($draw),
                'recordsTotal' => $totalRecords,
                'recordsFiltered' => $filteredRecords,
                'data' => $productos
            ];
            
            \Log::info('ProductoController DataTable response', $response);
            
            return response()->json($response);
            
        } catch (\Exception $e) {
            \Log::error('Error in ProductoController cargarDT: ' . $e->getMessage());
            return response()->json(['error' => 'Error loading data'], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categorias = CategoriaProducto::where('estado', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Admin/Productos/Create', [
            'categorias' => $categorias
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductoRequest $request)
    {
        try {
            $data = $request->validated();

            // Manejar imagen principal
            if ($request->hasFile('imagen_principal')) {
                $data['imagen_principal'] = $request->file('imagen_principal')
                    ->store('productos/imagenes', 'public');
            }

            // Manejar galería de imágenes
            if ($request->hasFile('galeria_imagenes')) {
                $galeria = [];
                foreach ($request->file('galeria_imagenes') as $imagen) {
                    $galeria[] = $imagen->store('productos/galeria', 'public');
                }
                $data['galeria_imagenes'] = $galeria;
            }

            // Manejar archivo de video
            if ($request->hasFile('video_file')) {
                $data['video_file'] = $request->file('video_file')
                    ->store('productos/videos', 'public');
            }

            // Crear el producto
            $producto = Producto::create($data);

            return redirect()
                ->route('admin.productos.index')
                ->with('success', 'Producto creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear el producto: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        $producto->load('categoriaProducto');

        return Inertia::render('Admin/Productos/Show', [
            'producto' => $producto
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {
        $categorias = CategoriaProducto::where('estado', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Admin/Productos/Edit', [
            'producto' => $producto,
            'categorias' => $categorias
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria_producto_id' => 'required|exists:categorias_productos,id',
            'estado' => 'required|in:activo,inactivo',
            'imagen_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'galeria_imagenes.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'imagenes_a_eliminar' => 'nullable|array',
            'imagenes_a_eliminar.*' => 'integer',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|mimes:mp4,avi,mov,wmv,flv|max:20480'
        ]);

        try {
            $data = $request->only([
                'nombre',
                'descripcion',
                'precio',
                'stock',
                'categoria_producto_id',
                'estado',
                'video_url'
            ]);

            // Manejar imagen principal
            if ($request->hasFile('imagen_principal')) {
                // Eliminar imagen anterior si existe
                if ($producto->imagen_principal) {
                    Storage::disk('public')->delete($producto->imagen_principal);
                }
                $data['imagen_principal'] = $request->file('imagen_principal')
                    ->store('productos/imagenes', 'public');
            }

            // Manejar galería de imágenes
            $galeriaActual = $producto->galeria_imagenes ?? [];
            
            // Eliminar imágenes específicas si se solicita
            if ($request->has('imagenes_a_eliminar')) {
                $imagenesAEliminar = $request->input('imagenes_a_eliminar');
                \Log::info('Imágenes a eliminar recibidas:', $imagenesAEliminar);
                \Log::info('Galería actual antes de eliminación:', $galeriaActual);
                
                if (is_array($imagenesAEliminar)) {
                    foreach ($imagenesAEliminar as $index) {
                        if (isset($galeriaActual[$index])) {
                            // Eliminar archivo físico
                            Storage::disk('public')->delete($galeriaActual[$index]);
                            \Log::info('Eliminando imagen física:', $galeriaActual[$index]);
                            // Eliminar de la galería actual
                            unset($galeriaActual[$index]);
                        }
                    }
                    // Reindexar el array
                    $galeriaActual = array_values($galeriaActual);
                    \Log::info('Galería después de eliminación:', $galeriaActual);
                }
            }

            // Agregar nuevas imágenes a la galería si se suben
            if ($request->hasFile('galeria_imagenes')) {
                foreach ($request->file('galeria_imagenes') as $imagen) {
                    $galeriaActual[] = $imagen->store('productos/galeria', 'public');
                }
            }
            
            // Actualizar la galería con las imágenes restantes (después de eliminar) y las nuevas
            $data['galeria_imagenes'] = $galeriaActual;

            // Manejar archivo de video
            if ($request->hasFile('video_file')) {
                // Eliminar video anterior si existe
                if ($producto->video_file) {
                    Storage::disk('public')->delete($producto->video_file);
                }
                $data['video_file'] = $request->file('video_file')
                    ->store('productos/videos', 'public');
            }

            // Actualizar el producto
            $producto->update($data);

            return redirect()
                ->route('admin.productos.index')
                ->with('success', 'Producto actualizado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Error al actualizar el producto: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle product status between active/inactive.
     */
    public function toggleStatus(Producto $producto)
    {
        try {
            $nuevoEstado = $producto->estado === 'activo' ? 'inactivo' : 'activo';
            $producto->update(['estado' => $nuevoEstado]);

            $mensaje = $nuevoEstado === 'activo' 
                ? 'Producto activado exitosamente.' 
                : 'Producto desactivado exitosamente.';

            return redirect()
                ->route('admin.productos.index')
                ->with('success', $mensaje);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Error al cambiar el estado del producto: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     * Only allows deletion if product is inactive.
     */
    public function destroy(Producto $producto)
    {
        try {
            // Solo permitir eliminación si el producto está inactivo
            if ($producto->estado !== 'inactivo') {
                return redirect()
                    ->back()
                    ->withErrors(['error' => 'Solo se pueden eliminar productos inactivos. Desactive el producto primero.']);
            }

            // Soft delete: cambiar estado a 'eliminado' en lugar de eliminar físicamente
            $producto->update(['estado' => 'eliminado']);

            return redirect()
                ->route('admin.productos.index')
                ->with('success', 'Producto eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Error al eliminar el producto: ' . $e->getMessage()]);
        }
    }
}
