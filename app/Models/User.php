<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'telefono',
        'direccion',
        'estado',
        'rol',
        'metodo_autenticacion',
        'id_oauth',
        'avatar_url',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'id_oauth',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'fecha_registro' => 'datetime',
        ];
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    public function scopeClientes($query)
    {
        return $query->where('rol', 'cliente');
    }

    public function scopeAdministradores($query)
    {
        return $query->whereIn('rol', ['superadmin', 'editor', 'gestor']);
    }

    // Accessors
    public function getEsActivoAttribute()
    {
        return $this->estado === 'activo';
    }

    public function getEsAdminAttribute()
    {
        return in_array($this->rol, ['superadmin', 'editor', 'gestor']);
    }

    // Relaciones
    public function carritos(): HasMany
    {
        return $this->hasMany(Carrito::class);
    }

    public function carritoActivo()
    {
        return $this->hasOne(Carrito::class)
                    ->where('estado', 'activo')
                    ->latest('created_at');
    }

    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class);
    }

    public function suscripciones(): HasMany
    {
        return $this->hasMany(Suscripcion::class);
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(ComentarioCalificacion::class);
    }

    // Métodos auxiliares
    public function puedeCrearComentario($productoId, $pedidoId): bool
    {
        $pedido = $this->pedidos()->where('id', $pedidoId)->first();
        if (!$pedido) {
            return false;
        }

        $tieneProducto = $pedido->detalles()
            ->where('producto_id', $productoId)
            ->exists();

        return $tieneProducto && $pedido->estado === 'completado';
    }
}
