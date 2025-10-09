<?php

namespace App\Console\Commands;

use App\Helpers\EmailHelper;
use App\Models\Pedido;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class MailtrapTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailtrap:test {email} {--type=all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Mailtrap email sending with different email types';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $type = $this->option('type');

        $this->info("🚀 Testing Mailtrap email sending to: {$email}");
        $this->info("📧 Mailtrap Configuration:");
        $this->info("   Host: " . config('mail.mailers.smtp.host'));
        $this->info("   Port: " . config('mail.mailers.smtp.port'));
        $this->info("   Encryption: " . config('mail.mailers.smtp.encryption'));
        $this->line('');

        $successCount = 0;
        $totalTests = 0;

        // Crear usuario de prueba
        $user = User::where('email', $email)->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Usuario de Prueba Mailtrap',
                'email' => $email,
                'password' => bcrypt('password'),
                'role' => 'client'
            ]);
            $this->info("✅ Created test user: {$user->name}");
        }

        $tests = [];

        if ($type === 'all' || $type === 'invoice') {
            $tests[] = [
                'name' => 'Invoice Email',
                'description' => 'Correo de factura con PDF adjunto',
                'test' => function() use ($email) {
                    $pedido = Pedido::with(['detalles.producto', 'user'])->first();
                    if (!$pedido) {
                        return false;
                    }
                    return EmailHelper::sendInvoiceEmail($pedido);
                }
            ];
        }

        if ($type === 'all' || $type === 'welcome') {
            $tests[] = [
                'name' => 'Welcome Email',
                'description' => 'Correo de bienvenida para nuevos usuarios',
                'test' => function() use ($user) {
                    return EmailHelper::sendWelcomeEmail($user);
                }
            ];
        }

        if ($type === 'all' || $type === 'notification') {
            $tests[] = [
                'name' => 'Custom Notification',
                'description' => 'Correo de notificación personalizado',
                'test' => function() use ($email, $user) {
                    $data = [
                        'greeting' => '¡Hola desde Mailtrap! 🎉',
                        'message' => 'Este es un correo de prueba para verificar que Mailtrap está funcionando correctamente.',
                        'alertType' => 'success',
                        'content' => '<div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                            <h3 style="color: #0369a1; margin-top: 0;">✅ Características Probadas:</h3>
                            <ul style="color: #0c4a6e;">
                                <li>🔗 Conexión SMTP a Mailtrap</li>
                                <li>🔐 Autenticación con credenciales</li>
                                <li>📧 Envío de correos HTML</li>
                                <li>📎 Adjuntos PDF</li>
                                <li>🎨 Plantillas responsivas</li>
                                <li>💰 Formato de moneda mexicana</li>
                            </ul>
                        </div>',
                        'actionUrl' => 'https://mailtrap.io',
                        'actionText' => 'Visitar Mailtrap',
                        'additionalInfo' => [
                            'Sistema: Laravel 11',
                            'Plantillas: Blade + CSS',
                            'PDF: DomPDF',
                            'SMTP: Mailtrap Sandbox'
                        ],
                        'closing' => '¡El sistema de correos está funcionando perfectamente con Mailtrap! 🚀'
                    ];
                    return EmailHelper::sendNotificationEmail(
                        $email,
                        'Prueba Completa de Mailtrap 📧',
                        $data,
                        $user
                    );
                }
            ];
        }

        if ($type === 'all' || $type === 'simple') {
            $tests[] = [
                'name' => 'Simple Test Email',
                'description' => 'Correo simple para verificar conectividad',
                'test' => function() use ($email) {
                    try {
                        Mail::raw('Este es un correo de prueba simple desde Laravel con Mailtrap. 🚀', function ($message) use ($email) {
                            $message->to($email)
                                   ->subject('Prueba Simple - Mailtrap');
                        });
                        return true;
                    } catch (\Exception $e) {
                        \Log::error('Simple email test failed: ' . $e->getMessage());
                        return false;
                    }
                }
            ];
        }

        // Ejecutar pruebas
        foreach ($tests as $test) {
            $totalTests++;
            $this->info("🧪 Testing: {$test['name']}");
            $this->info("   {$test['description']}");
            
            try {
                $result = $test['test']();
                if ($result) {
                    $this->info("   ✅ Success");
                    $successCount++;
                } else {
                    $this->error("   ❌ Failed");
                }
            } catch (\Exception $e) {
                $this->error("   ❌ Error: " . $e->getMessage());
            }
            $this->line('');
        }

        // Resumen
        $this->info("📊 Test Results:");
        $this->info("   Total Tests: {$totalTests}");
        $this->info("   Successful: {$successCount}");
        $this->info("   Failed: " . ($totalTests - $successCount));
        
        if ($successCount === $totalTests) {
            $this->info("🎉 All tests passed! Mailtrap is working perfectly!");
        } else {
            $this->warn("⚠️  Some tests failed. Check the logs for details.");
        }

        $this->line('');
        $this->info("📬 Check your Mailtrap inbox at: https://mailtrap.io");
        $this->info("   All emails should appear in your Mailtrap sandbox.");

        return $successCount === $totalTests ? 0 : 1;
    }
}