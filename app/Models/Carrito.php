<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrito extends Model
{
    protected $table = 'carrito';

    protected $fillable = [
        'user_id',
        'estado',
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function productos(): HasMany
    {
        return $this->hasMany(CarritoProducto::class);
    }

    // Métodos auxiliares
    public function getTotalAttribute()
    {
        return $this->productos->sum(function ($carritoProducto) {
            return $carritoProducto->cantidad * $carritoProducto->producto->precio;
        });
    }

    public function getCantidadTotalProductosAttribute()
    {
        return $this->productos->sum('cantidad');
    }

    public function agregarProducto($productoId, $cantidad = 1)
    {
        $carritoProducto = $this->productos()->where('producto_id', $productoId)->first();
        
        if ($carritoProducto) {
            $carritoProducto->increment('cantidad', $cantidad);
        } else {
            $this->productos()->create([
                'producto_id' => $productoId,
                'cantidad' => $cantidad,
            ]);
        }
    }

    public function vaciar()
    {
        $this->productos()->delete();
    }
}
