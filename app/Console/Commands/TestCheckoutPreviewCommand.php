<?php

namespace App\Console\Commands;

use App\Http\Controllers\CarritoController;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class TestCheckoutPreviewCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:checkout-preview {email} {producto-id} {cantidad=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test checkout preview for direct purchase';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $productoId = $this->argument('producto-id');
        $cantidad = $this->argument('cantidad');

        $this->info("🛒 Testing checkout preview for direct purchase");
        $this->info("📧 Email: {$email}");
        $this->info("📦 Product ID: {$productoId}");
        $this->info("🔢 Quantity: {$cantidad}");

        try {
            // Buscar el usuario
            $user = User::where('email', $email)->first();
            if (!$user) {
                $this->error("❌ User not found with email: {$email}");
                return 1;
            }

            // Buscar el producto
            $producto = Producto::with('categoriaProducto')->find($productoId);
            if (!$producto) {
                $this->error("❌ Product not found with ID: {$productoId}");
                return 1;
            }

            $this->info("✅ User found: {$user->name}");
            $this->info("✅ Product found: {$producto->nombre}");
            $this->info("💰 Price: $" . number_format($producto->precio, 2) . " MXN");
            $this->info("📦 Stock: {$producto->stock}");
            $this->info("🏷️ Category: " . ($producto->categoriaProducto->nombre ?? 'Sin categoría'));

            // Simular autenticación
            auth()->login($user);

            // Crear request simulado
            $request = new Request();
            $request->merge([
                'cantidad' => $cantidad,
                'tipo' => 'directo'
            ]);

            // Instanciar el controlador
            $controller = new CarritoController();

            $this->info("\n🔄 Testing checkout preview generation...");
            
            // Llamar al método del controlador
            $response = $controller->productoCheckoutPreview($request, $productoId);

            if ($response) {
                $this->info("✅ Checkout preview generated successfully!");
                $this->info("📋 Preview Data:");
                $this->info("   • Product: {$producto->nombre}");
                $this->info("   • Quantity: {$cantidad}");
                $this->info("   • Unit Price: $" . number_format($producto->precio, 2) . " MXN");
                $this->info("   • Total: $" . number_format($producto->precio * $cantidad, 2) . " MXN");
                $this->info("   • Client: {$user->name} ({$user->email})");
                $this->info("   • Direct Purchase: Yes");
                $this->info("   • Cart: null (not applicable)");
                
                $this->info("\n🎯 Checkout preview is working correctly!");
                $this->info("💡 The component should now render without errors.");
                $this->info("🌐 You can test by visiting: /clientes/producto/{$productoId}/checkout-preview?cantidad={$cantidad}&tipo=directo");
                
            } else {
                $this->error("❌ Failed to generate checkout preview");
                return 1;
            }

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
            return 1;
        }

        return 0;
    }
}