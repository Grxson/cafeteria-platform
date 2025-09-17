<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoCupon extends Model
{
    protected $table = 'pedido_cupon';
    public $incrementing = false;

    protected $fillable = [
        'pedido_id',
        'cupon_descuento_id',
        'descuento_aplicado',
    ];

    protected $casts = [
        'descuento_aplicado' => 'decimal:2',
    ];

    // Relaciones
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    public function cuponDescuento(): BelongsTo
    {
        return $this->belongsTo(CuponDescuento::class);
    }
}
