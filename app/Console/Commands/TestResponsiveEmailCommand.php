<?php

namespace App\Console\Commands;

use App\Helpers\EmailHelper;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Console\Command;

class TestResponsiveEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:responsive-email {email} {--pedido-id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test responsive email design with multiple products';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $pedidoId = $this->option('pedido-id');

        $this->info("📱 Testing responsive email design for: {$email}");

        try {
            if ($pedidoId) {
                // Usar un pedido existente
                $pedido = Pedido::with(['detalles.producto', 'user'])->find($pedidoId);
                if (!$pedido) {
                    $this->error("Pedido #{$pedidoId} not found");
                    return 1;
                }
                $this->info("📦 Using existing pedido #{$pedido->id}");
            } else {
                // Crear un pedido de prueba con múltiples productos
                $user = User::where('email', $email)->first();
                if (!$user) {
                    $user = User::create([
                        'name' => 'Usuario Responsive Test',
                        'email' => $email,
                        'password' => bcrypt('password'),
                        'role' => 'client'
                    ]);
                    $this->info("✅ Created test user: {$user->name}");
                }

                // Obtener múltiples productos
                $productos = Producto::where('stock', '>', 0)->take(3)->get();
                if ($productos->isEmpty()) {
                    $this->error("No hay productos disponibles para la prueba");
                    return 1;
                }

                // Calcular total
                $total = 0;
                foreach ($productos as $producto) {
                    $total += $producto->precio * 2; // 2 de cada producto
                }

                // Crear pedido de prueba
                $pedido = Pedido::create([
                    'user_id' => $user->id,
                    'total' => $total,
                    'estado' => 'completado',
                    'direccion_envio' => 'Calle Responsive 123, Colonia Test, Ciudad Test, Estado Test, 12345 (Tel: +52 55 1234 5678)',
                    'id_transaccion_pago' => 'pi_responsive_test_' . time()
                ]);

                // Crear detalles del pedido
                foreach ($productos as $producto) {
                    DetallePedido::create([
                        'pedido_id' => $pedido->id,
                        'producto_id' => $producto->id,
                        'cantidad' => 2,
                        'precio_unitario' => $producto->precio
                    ]);
                }

                $this->info("✅ Created test pedido #{$pedido->id} with {$productos->count()} products");
            }

            // Mostrar información del pedido
            $this->info("📋 Pedido Information:");
            $this->info("   ID: #{$pedido->id}");
            $this->info("   Cliente: {$pedido->user->name} ({$pedido->user->email})");
            $this->info("   Total: $" . number_format($pedido->total, 2) . " MXN");
            $this->info("   Estado: {$pedido->estado}");
            $this->info("   Productos: " . $pedido->detalles->count());

            // Mostrar características responsive
            $this->info("\n📱 Responsive Features:");
            $this->info("   ✅ Mobile-first design");
            $this->info("   ✅ Tablet optimization");
            $this->info("   ✅ Desktop layout");
            $this->info("   ✅ Mobile cards for products");
            $this->info("   ✅ Responsive typography");
            $this->info("   ✅ Flexible containers");
            $this->info("   ✅ Touch-friendly buttons");

            // Enviar correo
            $this->info("\n📧 Sending responsive email...");
            $pedido->load(['detalles.producto', 'user']);
            $emailSent = EmailHelper::sendInvoiceEmail($pedido);
            
            if ($emailSent) {
                $this->info("✅ Responsive email sent successfully!");
                $this->info("📬 Check your Mailtrap inbox at: https://mailtrap.io");
                $this->info("\n📱 Test the responsive design:");
                $this->info("   1. Open the email in Mailtrap");
                $this->info("   2. Switch between Desktop/Tablet/Mobile views");
                $this->info("   3. Verify layout adapts correctly");
                $this->info("   4. Check product table becomes cards on mobile");
                $this->info("   5. Ensure text remains readable at all sizes");
                
                $this->info("\n🎨 Design Features:");
                $this->info("   • Desktop: Full table layout");
                $this->info("   • Mobile: Card-based product display");
                $this->info("   • Responsive typography scaling");
                $this->info("   • Flexible padding and margins");
                $this->info("   • Cross-client compatibility");
                
            } else {
                $this->error("❌ Failed to send responsive email");
                return 1;
            }

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}