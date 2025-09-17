<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
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
            'direccion_envio' => 'required|string|max:500',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1|max:100',
            'cupon_codigo' => 'nullable|string|exists:cupones_descuento,codigo',
            'metodo_pago' => 'required|in:tarjeta,paypal,transferencia',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'direccion_envio.required' => 'La dirección de envío es obligatoria.',
            'direccion_envio.max' => 'La dirección de envío no puede tener más de 500 caracteres.',
            'productos.required' => 'Debe seleccionar al menos un producto.',
            'productos.min' => 'Debe seleccionar al menos un producto.',
            'productos.*.id.required' => 'ID de producto requerido.',
            'productos.*.id.exists' => 'El producto seleccionado no existe.',
            'productos.*.cantidad.required' => 'La cantidad es obligatoria.',
            'productos.*.cantidad.integer' => 'La cantidad debe ser un número entero.',
            'productos.*.cantidad.min' => 'La cantidad mínima es 1.',
            'productos.*.cantidad.max' => 'La cantidad máxima por producto es 100.',
            'cupon_codigo.exists' => 'El cupón ingresado no es válido.',
            'metodo_pago.required' => 'El método de pago es obligatorio.',
            'metodo_pago.in' => 'El método de pago seleccionado no es válido.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar stock de productos
            foreach ($this->productos as $item) {
                $producto = \App\Models\Producto::find($item['id']);
                if ($producto && $producto->stock < $item['cantidad']) {
                    $validator->errors()->add(
                        "productos.{$item['id']}.cantidad",
                        "Stock insuficiente para {$producto->nombre}. Stock disponible: {$producto->stock}"
                    );
                }
            }

            // Validar cupón si se proporciona
            if ($this->cupon_codigo) {
                $cupon = \App\Models\CuponDescuento::where('codigo', $this->cupon_codigo)->first();
                if ($cupon && !$cupon->puedeUsarse()) {
                    $validator->errors()->add('cupon_codigo', 'El cupón no está disponible o ha expirado.');
                }
            }
        });
    }
}
