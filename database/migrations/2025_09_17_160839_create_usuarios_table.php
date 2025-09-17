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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre', 100);
            $table->string('correo', 100)->unique();
            $table->string('telefono', 20)->nullable();
            $table->text('direccion')->nullable();
            $table->string('password');
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->enum('rol', ['cliente', 'superadmin', 'editor', 'gestor'])->default('cliente');
            $table->string('metodo_autenticacion', 50)->nullable();
            $table->string('id_oauth')->nullable();
            $table->string('avatar_url')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            
            // Índices
            $table->index('correo', 'idx_usuarios_correo');
            $table->index('estado');
            $table->index('rol');
            $table->index('fecha_registro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
