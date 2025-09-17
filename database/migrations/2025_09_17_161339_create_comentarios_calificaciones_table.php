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
        Schema::create('comentarios_calificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('producto_id')->constrained('productos')->onDelete('restrict');
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->integer('calificacion');
            $table->text('comentario')->nullable();
            $table->enum('estado', ['activo', 'oculto'])->default('activo');
            $table->timestamps();
            
            // Índices
            $table->index('calificacion');
            $table->index('estado');
            
            // Unique constraint para evitar múltiples comentarios del mismo usuario/producto/pedido
            $table->unique(['user_id', 'producto_id', 'pedido_id']);
        });

        // Agregar check constraint usando SQL directo
        \DB::statement('ALTER TABLE comentarios_calificaciones ADD CONSTRAINT chk_calificacion CHECK (calificacion >= 1 AND calificacion <= 5)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios_calificaciones');
    }
};
