<?php

namespace App\Console\Commands;

use App\Http\Controllers\StripeController;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;

class TestCheckoutRouteCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:checkout-route {email} {producto-id} {cantidad=2}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the exact checkout route that is failing in the frontend';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $productoId = $this->argument('producto-id');
        $cantidad = $this->argument('cantidad');

        $this->info("🛒 Testing exact checkout route that frontend calls");
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

            // Simular autenticación
            auth()->login($user);

            // Simular los datos que envía el frontend
            $direccionEnvio = [
                'calle' => 'prueba',
                'numero' => '123',
                'colonia' => '',
                'ciudad' => 'AJS FLAS',
                'estado' => 'apisnfpa',
                'codigo_postal' => '',
                'telefono' => '1234567890'
            ];

            // Crear request simulado con los datos exactos del frontend
            $request = new Request();
            $request->merge([
                'producto_id' => $productoId,
                'cantidad' => $cantidad,
                'direccion_envio' => $direccionEnvio
            ]);

            // Instanciar el controlador
            $controller = new StripeController();

            $this->info("\n🔄 Testing Stripe checkout route...");
            $this->info("📋 Request data:");
            $this->info("   • producto_id: {$productoId}");
            $this->info("   • cantidad: {$cantidad}");
            $this->info("   • direccion_envio: " . json_encode($direccionEnvio));
            
            // Llamar al método del controlador
            $response = $controller->createDirectCheckoutSession($request);
            $responseData = $response->getData(true);

            if ($response->getStatusCode() === 200 && $responseData['success']) {
                $this->info("✅ Stripe checkout route working correctly!");
                $this->info("🔗 Checkout URL: " . $responseData['checkout_url']);
                $this->info("\n🎯 The route is working fine from the backend.");
                $this->info("💡 The issue might be in the frontend request or CORS.");
                
            } else {
                $this->error("❌ Route failed");
                $this->error("Status: " . $response->getStatusCode());
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