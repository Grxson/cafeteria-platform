<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComentarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'producto_id' => 'required|exists:productos,id',
            'pedido_id' => 'required|exists:pedidos,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'producto_id.required' => 'El producto es obligatorio.',
            'producto_id.exists' => 'El producto seleccionado no existe.',
            'pedido_id.required' => 'El pedido es obligatorio.',
            'pedido_id.exists' => 'El pedido seleccionado no existe.',
            'calificacion.required' => 'La calificación es obligatoria.',
            'calificacion.integer' => 'La calificación debe ser un número entero.',
            'calificacion.min' => 'La calificación mínima es 1 estrella.',
            'calificacion.max' => 'La calificación máxima es 5 estrellas.',
            'comentario.max' => 'El comentario no puede tener más de 1000 caracteres.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = auth()->user();
            
            // Verificar que el usuario puede comentar este producto
            if (!$user->puedeCrearComentario($this->producto_id, $this->pedido_id)) {
                $validator->errors()->add(
                    'producto_id',
                    'No puedes comentar este producto. Debes haberlo comprado en el pedido especificado.'
                );
            }

            // Verificar que no exista ya un comentario para este producto/pedido/usuario
            $existeComentario = \App\Models\ComentarioCalificacion::where([
                'user_id' => $user->id,
                'producto_id' => $this->producto_id,
                'pedido_id' => $this->pedido_id,
            ])->exists();

            if ($existeComentario) {
                $validator->errors()->add(
                    'producto_id',
                    'Ya has comentado este producto para este pedido.'
                );
            }
        });
    }
}
