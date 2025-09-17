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
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total', 10, 2);
            $table->enum('estado', ['pendiente', 'pagado', 'enviado', 'completado', 'cancelado'])->default('pendiente');
            $table->text('direccion_envio');
            $table->string('id_transaccion_pago')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index('estado');
            $table->index('total');
            $table->index('id_transaccion_pago');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
