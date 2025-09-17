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
        Schema::create('cupones_descuento', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 50)->unique();
            $table->text('descripcion')->nullable();
            $table->enum('tipo_descuento', ['porcentaje', 'monto_fijo']);
            $table->decimal('valor_descuento', 10, 2);
            $table->date('fecha_inicio');
            $table->date('fecha_expiracion');
            $table->integer('usos_maximos');
            $table->integer('usos_actual')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();
            
            // Índices
            $table->index('estado');
            $table->index('fecha_inicio');
            $table->index('fecha_expiracion');
            $table->index(['fecha_inicio', 'fecha_expiracion']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cupones_descuento');
    }
};
