<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CuponDescuento extends Model
{
    protected $table = 'cupones_descuento';

    protected $fillable = [
        'codigo',
        'descripcion',
        'tipo_descuento',
        'valor_descuento',
        'fecha_inicio',
        'fecha_expiracion',
        'usos_maximos',
        'usos_actual',
        'estado',
    ];

    protected $casts = [
        'valor_descuento' => 'decimal:2',
        'fecha_inicio' => 'date',
        'fecha_expiracion' => 'date',
        'usos_maximos' => 'integer',
        'usos_actual' => 'integer',
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeVigentes($query)
    {
        return $query->where('fecha_inicio', '<=', now())
                    ->where('fecha_expiracion', '>=', now());
    }

    public function scopeDisponibles($query)
    {
        return $query->activos()
                    ->vigentes()
                    ->whereRaw('usos_actual < usos_maximos');
    }

    // Relaciones
    public function pedidos(): BelongsToMany
    {
        return $this->belongsToMany(Pedido::class, 'pedido_cupon')
                    ->withPivot('descuento_aplicado')
                    ->withTimestamps();
    }

    // Métodos auxiliares
    public function puedeUsarse(): bool
    {
        return $this->estado === 'activo' 
            && $this->fecha_inicio <= now() 
            && $this->fecha_expiracion >= now()
            && $this->usos_actual < $this->usos_maximos;
    }

    public function calcularDescuento($subtotal): float
    {
        if ($this->tipo_descuento === 'porcentaje') {
            return $subtotal * ($this->valor_descuento / 100);
        }
        
        return min($this->valor_descuento, $subtotal);
    }
}
