<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Models\Producto;
use App\Models\CategoriaProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = Producto::with('categoriaProducto')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Productos/Index', [
            'productos' => $productos
        ]);
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
            if ($request->hasFile('galeria_imagenes')) {
                // Eliminar imágenes anteriores si existen
                if ($producto->galeria_imagenes) {
                    foreach ($producto->galeria_imagenes as $imagen) {
                        Storage::disk('public')->delete($imagen);
                    }
                }

                $galeria = [];
                foreach ($request->file('galeria_imagenes') as $imagen) {
                    $galeria[] = $imagen->store('productos/galeria', 'public');
                }
                $data['galeria_imagenes'] = $galeria;
            }

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
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        try {
            // Eliminar imágenes del storage
            if ($producto->imagen_principal) {
                Storage::disk('public')->delete($producto->imagen_principal);
            }

            if ($producto->galeria_imagenes) {
                foreach ($producto->galeria_imagenes as $imagen) {
                    Storage::disk('public')->delete($imagen);
                }
            }

            $producto->delete();

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
