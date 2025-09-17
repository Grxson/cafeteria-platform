<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaProducto extends Model
{
    protected $table = 'categorias_productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    // Accessors
    public function getEsActivaAttribute()
    {
        return $this->estado === 'activo';
    }

    // Relaciones
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'categoria_producto_id');
    }

    public function productosActivos(): HasMany
    {
        return $this->hasMany(Producto::class, 'categoria_producto_id')
                    ->where('estado', 'activo');
    }

    // Métodos auxiliares
    public function getTotalProductosAttribute()
    {
        return $this->productos()->count();
    }

    public function getTotalProductosActivosAttribute()
    {
        return $this->productosActivos()->count();
    }
}
