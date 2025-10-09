<?php

namespace App\Console\Commands;

use App\Helpers\EmailHelper;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\User;
use App\Models\Producto;
use Illuminate\Console\Command;

class TestPaymentFlowCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:payment-flow {email} {--pedido-id=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the complete payment flow and email sending';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $pedidoId = $this->option('pedido-id');

        $this->info("🧪 Testing complete payment flow for: {$email}");

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
                // Crear un pedido de prueba
                $user = User::where('email', $email)->first();
                if (!$user) {
                    $user = User::create([
                        'name' => 'Usuario de Prueba',
                        'email' => $email,
                        'password' => bcrypt('password'),
                        'role' => 'client'
                    ]);
                    $this->info("✅ Created test user: {$user->name}");
                }

                // Obtener un producto disponible
                $producto = Producto::where('stock', '>', 0)->first();
                if (!$producto) {
                    $this->error("No hay productos disponibles para la prueba");
                    return 1;
                }

                // Crear pedido de prueba
                $pedido = Pedido::create([
                    'user_id' => $user->id,
                    'total' => $producto->precio * 2, // 2 productos
                    'estado' => 'completado',
                    'direccion_envio' => 'Calle de Prueba 123, Colonia Test, Ciudad Test, Estado Test, 12345',
                    'id_transaccion_pago' => 'pi_test_' . time()
                ]);

                // Crear detalle del pedido
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'cantidad' => 2,
                    'precio_unitario' => $producto->precio
                ]);

                $this->info("✅ Created test pedido #{$pedido->id} with producto: {$producto->nombre}");
            }

            // Mostrar información del pedido
            $this->info("📋 Pedido Information:");
            $this->info("   ID: #{$pedido->id}");
            $this->info("   Cliente: {$pedido->user->name} ({$pedido->user->email})");
            $this->info("   Total: $" . number_format($pedido->total, 2) . " MXN");
            $this->info("   Estado: {$pedido->estado}");
            $this->info("   Productos: " . $pedido->detalles->count());

            // Simular el envío de correo como lo hace el StripeController
            $this->info("\n📧 Sending invoice email...");
            
            // Cargar relaciones (como lo hace el StripeController)
            $pedido->load(['detalles.producto', 'user']);
            
            // Enviar correo
            $emailSent = EmailHelper::sendInvoiceEmail($pedido);
            
            if ($emailSent) {
                $this->info("✅ Invoice email sent successfully!");
                $this->info("📬 Check your Mailtrap inbox at: https://mailtrap.io");
                $this->info("   Email should contain:");
                $this->info("   - Order details");
                $this->info("   - Product information");
                $this->info("   - PDF attachment");
                $this->info("   - Total amount");
                
                // Log como lo hace el StripeController
                \Log::info("Correo de factura enviado exitosamente para pedido #{$pedido->id} a {$pedido->user->email}");
            } else {
                $this->error("❌ Failed to send invoice email");
                \Log::error("Error enviando correo de factura para pedido #{$pedido->id}");
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