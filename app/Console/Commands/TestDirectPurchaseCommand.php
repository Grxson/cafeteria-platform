<?php

namespace App\Console\Commands;

use App\Http\Controllers\StripeController;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class TestDirectPurchaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:direct-purchase {email} {producto-id} {cantidad=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test direct purchase functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $productoId = $this->argument('producto-id');
        $cantidad = $this->argument('cantidad');

        $this->info("🛒 Testing direct purchase functionality");
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
            $producto = Producto::find($productoId);
            if (!$producto) {
                $this->error("❌ Product not found with ID: {$productoId}");
                return 1;
            }

            $this->info("✅ User found: {$user->name}");
            $this->info("✅ Product found: {$producto->nombre}");
            $this->info("💰 Price: $" . number_format($producto->precio, 2) . " MXN");
            $this->info("📦 Stock: {$producto->stock}");

            // Verificar stock
            if ($producto->stock < $cantidad) {
                $this->error("❌ Insufficient stock. Available: {$producto->stock}, Requested: {$cantidad}");
                return 1;
            }

            // Simular autenticación
            auth()->login($user);

            // Crear request simulado
            $request = new Request();
            $request->merge([
                'producto_id' => $productoId,
                'cantidad' => $cantidad,
            ]);

            // Instanciar el controlador
            $controller = new StripeController();

            $this->info("\n🔄 Creating Stripe checkout session...");
            
            // Llamar al método del controlador
            $response = $controller->createDirectCheckoutSession($request);
            $responseData = $response->getData(true);

            if ($response->getStatusCode() === 200 && $responseData['success']) {
                $this->info("✅ Stripe checkout session created successfully!");
                $this->info("🔗 Checkout URL: " . $responseData['checkout_url']);
                $this->info("\n📋 Session Details:");
                $this->info("   • Product: {$producto->nombre}");
                $this->info("   • Quantity: {$cantidad}");
                $this->info("   • Unit Price: $" . number_format($producto->precio, 2) . " MXN");
                $this->info("   • Total: $" . number_format($producto->precio * $cantidad, 2) . " MXN");
                $this->info("   • Currency: MXN");
                $this->info("   • Customer: {$user->name} ({$user->email})");
                
                $this->info("\n🎯 Direct purchase is working correctly!");
                $this->info("💡 You can now test the 'Comprar Ahora' button in the product detail page.");
                
            } else {
                $this->error("❌ Failed to create checkout session");
                $this->error("Response: " . json_encode($responseData));
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