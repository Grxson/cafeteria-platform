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
        // Primero verificar si existen constraints y eliminarlas si es necesario
        $foreignKeys = \DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'comentarios_calificaciones' 
            AND CONSTRAINT_NAME LIKE '%foreign%'
            AND COLUMN_NAME = 'pedido_id'
        ");
        
        foreach ($foreignKeys as $fk) {
            \DB::statement("ALTER TABLE comentarios_calificaciones DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
        }
        
        // Eliminar índice único si existe
        $uniqueIndexes = \DB::select("
            SELECT INDEX_NAME 
            FROM information_schema.STATISTICS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'comentarios_calificaciones' 
            AND INDEX_NAME LIKE '%unique%'
            AND COLUMN_NAME IN ('user_id', 'producto_id', 'pedido_id')
        ");
        
        foreach ($uniqueIndexes as $index) {
            try {
                \DB::statement("ALTER TABLE comentarios_calificaciones DROP INDEX {$index->INDEX_NAME}");
            } catch (\Exception $e) {
                // Ignorar si el índice no existe
            }
        }
        
        // Modificar la columna para que sea nullable
        \DB::statement('ALTER TABLE comentarios_calificaciones MODIFY pedido_id BIGINT UNSIGNED NULL');
        
        // Recrear la foreign key constraint
        \DB::statement('ALTER TABLE comentarios_calificaciones ADD CONSTRAINT comentarios_calificaciones_pedido_id_foreign FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar la foreign key
        \DB::statement('ALTER TABLE comentarios_calificaciones DROP FOREIGN KEY comentarios_calificaciones_pedido_id_foreign');
        
        // Hacer la columna no nullable nuevamente
        \DB::statement('ALTER TABLE comentarios_calificaciones MODIFY pedido_id BIGINT UNSIGNED NOT NULL');
        
        // Recrear la foreign key original
        \DB::statement('ALTER TABLE comentarios_calificaciones ADD CONSTRAINT comentarios_calificaciones_pedido_id_foreign FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE');
        
        // Recrear el índice único original
        \DB::statement('ALTER TABLE comentarios_calificaciones ADD UNIQUE KEY comentarios_calificaciones_user_id_producto_id_pedido_id_unique (user_id, producto_id, pedido_id)');
    }
};