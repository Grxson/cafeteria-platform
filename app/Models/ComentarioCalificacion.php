<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComentarioCalificacion extends Model
{
    protected $table = 'comentarios_calificaciones';

    protected $fillable = [
        'user_id',
        'producto_id',
        'pedido_id',
        'calificacion',
        'comentario',
        'estado',
    ];

    protected $casts = [
        'calificacion' => 'integer',
    ];

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopePorCalificacion($query, $calificacion)
    {
        return $query->where('calificacion', $calificacion);
    }

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    // Accessors
    public function getCalificacionEstrellas()
    {
        return str_repeat('★', $this->calificacion) . str_repeat('☆', 5 - $this->calificacion);
    }
}
