<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && in_array(auth()->user()->rol, ['superadmin', 'editor', 'gestor']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:2000',
            'precio' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0',
            'categoria_producto_id' => 'required|exists:categorias_productos,id',
            'imagen_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'galeria_imagenes' => 'nullable|array|max:5',
            'galeria_imagenes.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'video_url' => 'nullable|url|max:255',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB máximo
            'estado' => 'required|in:activo,inactivo',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',
            'precio.required' => 'El precio es obligatorio.',
            'precio.numeric' => 'El precio debe ser un número válido.',
            'precio.min' => 'El precio no puede ser negativo.',
            'precio.max' => 'El precio no puede ser mayor a $999,999.99.',
            'stock.required' => 'El stock es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',
            'categoria_producto_id.required' => 'La categoría es obligatoria.',
            'categoria_producto_id.exists' => 'La categoría seleccionada no existe.',
            'imagen_principal.image' => 'La imagen principal debe ser un archivo de imagen.',
            'imagen_principal.mimes' => 'La imagen principal debe ser de tipo: jpeg, png, jpg o gif.',
            'imagen_principal.max' => 'La imagen principal no puede ser mayor a 2MB.',
            'galeria_imagenes.max' => 'No se pueden subir más de 5 imágenes a la galería.',
            'galeria_imagenes.*.image' => 'Todos los archivos de la galería deben ser imágenes.',
            'galeria_imagenes.*.max' => 'Cada imagen de la galería no puede ser mayor a 2MB.',
            'video_url.url' => 'La URL del video debe ser válida.',
            'video_file.file' => 'El archivo de video debe ser un archivo válido.',
            'video_file.mimes' => 'El video debe ser de tipo: mp4, avi, mov, wmv, flv o webm.',
            'video_file.max' => 'El archivo de video no puede ser mayor a 50MB.',
            'estado.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
