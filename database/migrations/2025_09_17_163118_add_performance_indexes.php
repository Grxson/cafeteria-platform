<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            // Índices compuestos para consultas frecuentes
            $table->index(['estado', 'stock'], 'idx_productos_disponibles');
            $table->index(['categoria_producto_id', 'estado'], 'idx_productos_categoria_estado');
            $table->index(['precio', 'estado'], 'idx_productos_precio_estado');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            // Índices para reportes y consultas de pedidos
            $table->index(['user_id', 'estado'], 'idx_pedidos_usuario_estado');
            $table->index(['estado', 'created_at'], 'idx_pedidos_estado_fecha');
            $table->index(['created_at', 'total'], 'idx_pedidos_fecha_total');
        });

        Schema::table('carrito', function (Blueprint $table) {
            // Índice para carritos activos por usuario
            $table->index(['user_id', 'estado'], 'idx_carrito_usuario_estado');
        });

        Schema::table('suscripciones', function (Blueprint $table) {
            // Índices para gestión de suscripciones
            $table->index(['estado', 'fecha_proximo_envio'], 'idx_suscripciones_estado_envio');
            $table->index(['user_id', 'estado'], 'idx_suscripciones_usuario_estado');
        });

        Schema::table('comentarios_calificaciones', function (Blueprint $table) {
            // Índices para mostrar comentarios por producto
            $table->index(['producto_id', 'estado'], 'idx_comentarios_producto_estado');
            $table->index(['producto_id', 'calificacion'], 'idx_comentarios_producto_calificacion');
        });

        Schema::table('cupones_descuento', function (Blueprint $table) {
            // Índices para validación de cupones
            $table->index(['estado', 'fecha_inicio', 'fecha_expiracion'], 'idx_cupones_vigencia');
        });

        // Crear vista para productos populares
        \DB::statement("
            CREATE VIEW productos_populares AS
            SELECT 
                p.*,
                COALESCE(AVG(cc.calificacion), 0) as calificacion_promedio,
                COUNT(cc.id) as total_comentarios,
                COALESCE(SUM(dp.cantidad), 0) as total_vendidos
            FROM productos p
            LEFT JOIN comentarios_calificaciones cc ON p.id = cc.producto_id AND cc.estado = 'activo'
            LEFT JOIN detalle_pedido dp ON p.id = dp.producto_id
            LEFT JOIN pedidos pe ON dp.pedido_id = pe.id AND pe.estado = 'completado'
            WHERE p.estado = 'activo'
            GROUP BY p.id
        ");

        // Crear vista para estadísticas de usuario
        \DB::statement("
            CREATE VIEW estadisticas_usuarios AS
            SELECT 
                u.id,
                u.name,
                u.email,
                COUNT(DISTINCT p.id) as total_pedidos,
                COALESCE(SUM(p.total), 0) as total_gastado,
                COUNT(DISTINCT s.id) as total_suscripciones,
                COUNT(DISTINCT cc.id) as total_comentarios,
                MAX(p.created_at) as ultimo_pedido
            FROM users u
            LEFT JOIN pedidos p ON u.id = p.user_id
            LEFT JOIN suscripciones s ON u.id = s.user_id
            LEFT JOIN comentarios_calificaciones cc ON u.id = cc.user_id
            GROUP BY u.id, u.name, u.email
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar vistas
        \DB::statement("DROP VIEW IF EXISTS productos_populares");
        \DB::statement("DROP VIEW IF EXISTS estadisticas_usuarios");

        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex('idx_productos_disponibles');
            $table->dropIndex('idx_productos_categoria_estado');
            $table->dropIndex('idx_productos_precio_estado');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropIndex('idx_pedidos_usuario_estado');
            $table->dropIndex('idx_pedidos_estado_fecha');
            $table->dropIndex('idx_pedidos_fecha_total');
        });

        Schema::table('carrito', function (Blueprint $table) {
            $table->dropIndex('idx_carrito_usuario_estado');
        });

        Schema::table('suscripciones', function (Blueprint $table) {
            $table->dropIndex('idx_suscripciones_estado_envio');
            $table->dropIndex('idx_suscripciones_usuario_estado');
        });

        Schema::table('comentarios_calificaciones', function (Blueprint $table) {
            $table->dropIndex('idx_comentarios_producto_estado');
            $table->dropIndex('idx_comentarios_producto_calificacion');
        });

        Schema::table('cupones_descuento', function (Blueprint $table) {
            $table->dropIndex('idx_cupones_vigencia');
        });
    }
};
