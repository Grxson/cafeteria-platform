<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pedido extends Model
{
    protected $fillable = [
        'user_id',
        'total',
        'estado',
        'direccion_envio',
        'id_transaccion_pago',
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    // Scopes
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    public function scopeCompletados($query)
    {
        return $query->where('estado', 'completado');
    }

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetallePedido::class);
    }

    public function cupones(): BelongsToMany
    {
        return $this->belongsToMany(CuponDescuento::class, 'pedido_cupon')
                    ->withPivot('descuento_aplicado')
                    ->withTimestamps();
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(ComentarioCalificacion::class);
    }

    public function historialEnvios(): HasMany
    {
        return $this->hasMany(SuscripcionHistorialEnvio::class);
    }

    // Métodos auxiliares
    public function puedeSerComentado(): bool
    {
        return $this->estado === 'completado';
    }

    public function calcularSubtotal(): float
    {
        return $this->detalles->sum(function ($detalle) {
            return $detalle->cantidad * $detalle->precio_unitario;
        });
    }

    public function calcularDescuentos(): float
    {
        return $this->cupones->sum('pivot.descuento_aplicado');
    }
}
