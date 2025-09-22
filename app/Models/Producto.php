<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'categoria_producto_id',
        'imagen_principal',
        'galeria_imagenes',
        'video_url',
        'video_file',
        'estado',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'stock' => 'integer',
        'galeria_imagenes' => 'array',
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeConStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeDisponibles($query)
    {
        return $query->activos()->conStock();
    }

    // Accessors
    public function getEsActivoAttribute()
    {
        return $this->estado === 'activo';
    }

    public function getTieneStockAttribute()
    {
        return $this->stock > 0;
    }

    public function getEsDisponibleAttribute()
    {
        return $this->es_activo && $this->tiene_stock;
    }

    public function getPrecioFormateadoAttribute()
    {
        return '$' . number_format((float)$this->precio, 2);
    }

    // Relaciones
    public function categoriaProducto(): BelongsTo
    {
        return $this->belongsTo(CategoriaProducto::class);
    }

    public function carritoProductos(): HasMany
    {
        return $this->hasMany(CarritoProducto::class);
    }

    public function detallesPedido(): HasMany
    {
        return $this->hasMany(DetallePedido::class);
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(ComentarioCalificacion::class);
    }

    public function suscripcionProductos(): HasMany
    {
        return $this->hasMany(SuscripcionProducto::class);
    }
}
