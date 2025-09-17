<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Suscripcion extends Model
{
    protected $table = 'suscripciones';

    protected $fillable = [
        'user_id',
        'nombre',
        'fecha_inicio',
        'fecha_proximo_envio',
        'frecuencia',
        'estado',
        'total',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_proximo_envio' => 'date',
        'total' => 'decimal:2',
    ];

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('estado', 'activa');
    }

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function productos(): HasMany
    {
        return $this->hasMany(SuscripcionProducto::class);
    }

    public function historialEnvios(): HasMany
    {
        return $this->hasMany(SuscripcionHistorialEnvio::class);
    }

    // Métodos auxiliares
    public function calcularProximaFecha()
    {
        $interval = match ($this->frecuencia) {
            'mensual' => '+1 month',
            'trimestral' => '+3 months',
            'semestral' => '+6 months',
        };

        $this->fecha_proximo_envio = date('Y-m-d', strtotime($interval, strtotime($this->fecha_proximo_envio)));
        $this->save();
    }
}
