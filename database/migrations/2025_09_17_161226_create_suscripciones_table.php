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
        Schema::create('suscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nombre', 100)->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_proximo_envio');
            $table->enum('frecuencia', ['mensual', 'trimestral', 'semestral']);
            $table->enum('estado', ['activa', 'pausada', 'cancelada'])->default('activa');
            $table->decimal('total', 10, 2);
            $table->timestamps();
            
            // Índices
            $table->index('estado');
            $table->index('frecuencia');
            $table->index('fecha_proximo_envio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suscripciones');
    }
};
