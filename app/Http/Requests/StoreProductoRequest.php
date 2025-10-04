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
        $user = $this->user();
        $authorized = $user && in_array($user->rol, ['superadmin', 'editor', 'gestor']);
        
        \Log::info('StoreProductoRequest authorize check', [
            'user_id' => $user ? $user->id : null,
            'user_rol' => $user ? $user->rol : null,
            'authorized' => $authorized
        ]);
        
        return $authorized;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        \Log::info('StoreProductoRequest validation rules', [
            'all_data' => $this->all(),
            'files' => $this->allFiles(),
            'galeria_imagenes_present' => $this->has('galeria_imagenes'),
            'galeria_imagenes_count' => $this->hasFile('galeria_imagenes') ? count($this->file('galeria_imagenes')) : 0
        ]);

        return [
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:2000',
            'precio' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0',
            'categoria_producto_id' => 'required|exists:categorias_productos,id',
            'imagen_principal' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'galeria_imagenes' => 'nullable|array|max:5',
            // Permitir que algunos archivos de galería sean nulos/inválidos
            'galeria_imagenes.*' => 'nullable',
            'video_url' => 'nullable|url|max:255',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,webm|max:51200', // 50MB máximo
            'estado' => 'required|in:activo,inactivo',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar individualmente los archivos válidos de galería
            if ($this->hasFile('galeria_imagenes')) {
                $galeriaImagenes = $this->file('galeria_imagenes');
                foreach ($galeriaImagenes as $index => $file) {
                    if ($file && $file->isValid() && $file->getSize() > 0) {
                        // Validar archivo individual
                        if (!in_array($file->getMimeType(), ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'])) {
                            $validator->errors()->add("galeria_imagenes.{$index}", "El archivo {$index} debe ser una imagen válida (jpeg, png, jpg, gif).");
                        }
                        if ($file->getSize() > 2048 * 1024) { // 2MB en bytes
                            $validator->errors()->add("galeria_imagenes.{$index}", "El archivo {$index} no puede ser mayor a 2MB.");
                        }
                    }
                }
            }
        });
    }

    /**
     * Prepare the data for validation.
     */
    public function prepareForValidation()
    {
        \Log::info('prepareForValidation called', [
            'has_galeria_imagenes' => $this->hasFile('galeria_imagenes'),
            'all_data' => $this->except(['imagen_principal', 'galeria_imagenes', 'video_file'])
        ]);
        
        // Solo logear información de archivos para debugging
        if ($this->hasFile('galeria_imagenes')) {
            $galeriaImagenes = $this->file('galeria_imagenes');
            
            if (is_array($galeriaImagenes)) {
                foreach ($galeriaImagenes as $index => $file) {
                    if ($file && $file->isValid() && $file->getSize() > 0) {
                        \Log::info("Valid galeria file at index {$index}", [
                            'name' => $file->getClientOriginalName(),
                            'size' => $file->getSize(),
                            'mime' => $file->getMimeType()
                        ]);
                    } else {
                        \Log::warning("Invalid galeria file at index {$index}", [
                            'is_valid' => $file ? $file->isValid() : false,
                            'size' => $file ? $file->getSize() : 0,
                            'error' => $file ? $file->getError() : 'File is null',
                            'error_message' => $file ? $file->getErrorMessage() : 'No file'
                        ]);
                    }
                }
            }
        }
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
            'galeria_imagenes.*.image' => 'Todos los archivos de la galería deben ser imágenes válidas.',
            'galeria_imagenes.*.mimes' => 'Las imágenes de la galería deben ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.*.max' => 'Cada imagen de la galería no puede ser mayor a 2MB.',
            'galeria_imagenes.0.image' => 'El primer archivo de la galería debe ser una imagen válida.',
            'galeria_imagenes.1.image' => 'El segundo archivo de la galería debe ser una imagen válida.',
            'galeria_imagenes.2.image' => 'El tercer archivo de la galería debe ser una imagen válida.',
            'galeria_imagenes.3.image' => 'El cuarto archivo de la galería debe ser una imagen válida.',
            'galeria_imagenes.4.image' => 'El quinto archivo de la galería debe ser una imagen válida.',
            'galeria_imagenes.0.mimes' => 'El primer archivo de la galería debe ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.1.mimes' => 'El segundo archivo de la galería debe ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.2.mimes' => 'El tercer archivo de la galería debe ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.3.mimes' => 'El cuarto archivo de la galería debe ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.4.mimes' => 'El quinto archivo de la galería debe ser de tipo: jpeg, png, jpg o gif.',
            'galeria_imagenes.0.max' => 'El primer archivo de la galería no puede ser mayor a 2MB.',
            'galeria_imagenes.1.max' => 'El segundo archivo de la galería no puede ser mayor a 2MB.',
            'galeria_imagenes.2.max' => 'El tercer archivo de la galería no puede ser mayor a 2MB.',
            'galeria_imagenes.3.max' => 'El cuarto archivo de la galería no puede ser mayor a 2MB.',
            'galeria_imagenes.4.max' => 'El quinto archivo de la galería no puede ser mayor a 2MB.',
            'video_url.url' => 'La URL del video debe ser válida.',
            'video_file.file' => 'El archivo de video debe ser un archivo válido.',
            'video_file.mimes' => 'El video debe ser de tipo: mp4, avi, mov, wmv, flv o webm.',
            'video_file.max' => 'El archivo de video no puede ser mayor a 50MB.',
            'estado.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
