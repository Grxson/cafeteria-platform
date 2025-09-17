<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuscripcionHistorialEnvio extends Model
{
    protected $table = 'suscripcion_historial_envios';

    protected $fillable = [
        'suscripcion_id',
        'fecha_envio',
        'estado',
        'total',
        'pedido_id',
    ];

    protected $casts = [
        'fecha_envio' => 'date',
        'total' => 'decimal:2',
    ];

    // Relaciones
    public function suscripcion(): BelongsTo
    {
        return $this->belongsTo(Suscripcion::class);
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }
}
