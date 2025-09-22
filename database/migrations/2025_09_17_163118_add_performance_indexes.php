<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $index): bool
    {
        try {
            $indexes = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$index]);
            return !empty($indexes);
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only create indexes that won't conflict with foreign keys
        
        Schema::table('productos', function (Blueprint $table) {
            // Index for product availability queries (avoiding FK conflicts)
            if (!$this->indexExists('productos', 'idx_productos_disponibles')) {
                $table->index(['estado', 'stock'], 'idx_productos_disponibles');
            }
            
            // Index for price filtering with status
            if (!$this->indexExists('productos', 'idx_productos_precio_estado')) {
                $table->index(['precio', 'estado'], 'idx_productos_precio_estado');
            }
        });

        Schema::table('comentarios_calificaciones', function (Blueprint $table) {
            // Index for product reviews (safe from FK conflicts)
            if (!$this->indexExists('comentarios_calificaciones', 'idx_comentarios_producto_estado')) {
                $table->index(['producto_id', 'estado'], 'idx_comentarios_producto_estado');
            }
            
            if (!$this->indexExists('comentarios_calificaciones', 'idx_comentarios_producto_calificacion')) {
                $table->index(['producto_id', 'calificacion'], 'idx_comentarios_producto_calificacion');
            }
        });

        Schema::table('cupones_descuento', function (Blueprint $table) {
            // Index for coupon validation (safe from FK conflicts)
            if (!$this->indexExists('cupones_descuento', 'idx_cupones_vigencia')) {
                $table->index(['estado', 'fecha_inicio', 'fecha_expiracion'], 'idx_cupones_vigencia');
            }
        });

        // Create database views for better performance (only if they don't exist)
        $existingViews = DB::select("SHOW TABLES LIKE 'productos_populares'");
        if (empty($existingViews)) {
            DB::statement("
                CREATE VIEW productos_populares AS
                SELECT 
                    p.*,
                    COALESCE(AVG(cc.calificacion), 0) as calificacion_promedio,
                    COUNT(cc.id) as total_comentarios
                FROM productos p
                LEFT JOIN comentarios_calificaciones cc ON p.id = cc.producto_id AND cc.estado = 'activo'
                WHERE p.estado = 'activo'
                GROUP BY p.id
            ");
        }
    }

    /**
     * Check if an index is safe to drop (not used by foreign key)
     */
    private function indexSafeToDrop(string $table, string $index): bool
    {
        try {
            // Check if index is used by foreign key constraint
            $fks = DB::select("
                SELECT CONSTRAINT_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = ? 
                AND TABLE_SCHEMA = DATABASE()
                AND CONSTRAINT_NAME != 'PRIMARY'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ", [$table]);
            
            // If this index contains foreign key columns, it might not be safe to drop
            foreach ($fks as $fk) {
                if (stripos($fk->CONSTRAINT_NAME, str_replace('idx_', '', $index)) !== false) {
                    return false;
                }
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop database views first
        DB::statement("DROP VIEW IF EXISTS productos_populares");

        // Drop indexes that were safely created and are safe to drop
        Schema::table('productos', function (Blueprint $table) {
            if ($this->indexExists('productos', 'idx_productos_disponibles') && $this->indexSafeToDrop('productos', 'idx_productos_disponibles')) {
                $table->dropIndex('idx_productos_disponibles');
            }
            if ($this->indexExists('productos', 'idx_productos_precio_estado') && $this->indexSafeToDrop('productos', 'idx_productos_precio_estado')) {
                $table->dropIndex('idx_productos_precio_estado');
            }
        });

        Schema::table('comentarios_calificaciones', function (Blueprint $table) {
            if ($this->indexExists('comentarios_calificaciones', 'idx_comentarios_producto_estado') && $this->indexSafeToDrop('comentarios_calificaciones', 'idx_comentarios_producto_estado')) {
                $table->dropIndex('idx_comentarios_producto_estado');
            }
            if ($this->indexExists('comentarios_calificaciones', 'idx_comentarios_producto_calificacion') && $this->indexSafeToDrop('comentarios_calificaciones', 'idx_comentarios_producto_calificacion')) {
                $table->dropIndex('idx_comentarios_producto_calificacion');
            }
        });

        Schema::table('cupones_descuento', function (Blueprint $table) {
            if ($this->indexExists('cupones_descuento', 'idx_cupones_vigencia') && $this->indexSafeToDrop('cupones_descuento', 'idx_cupones_vigencia')) {
                $table->dropIndex('idx_cupones_vigencia');
            }
        });
    }
};
