<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarritoProducto extends Model
{
    protected $table = 'carrito_productos';

    protected $fillable = [
        'carrito_id',
        'producto_id',
        'cantidad',
    ];

    protected $casts = [
        'cantidad' => 'integer',
    ];

    // Relaciones
    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    // Accessors
    public function getSubtotalAttribute()
    {
        return $this->cantidad * $this->producto->precio;
    }
}
