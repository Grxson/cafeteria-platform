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
        Schema::create('pedido_cupon', function (Blueprint $table) {
            $table->foreignId('pedido_id')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('cupon_descuento_id')->constrained('cupones_descuento')->onDelete('restrict');
            $table->decimal('descuento_aplicado', 10, 2);
            $table->timestamps();
            
            // Clave primaria compuesta
            $table->primary(['pedido_id', 'cupon_descuento_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pedido_cupon');
    }
};
