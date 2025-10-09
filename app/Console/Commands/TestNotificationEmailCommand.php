<?php

namespace App\Console\Commands;

use App\Helpers\EmailHelper;
use App\Models\User;
use Illuminate\Console\Command;

class TestNotificationEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:notification-email {email} {--type=welcome}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test notification email sending functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $type = $this->option('type');

        $this->info("Testing {$type} notification email to: {$email}");

        try {
            // Crear un usuario de prueba si no existe
            $user = User::where('email', $email)->first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Usuario de Prueba',
                    'email' => $email,
                    'password' => bcrypt('password'),
                    'role' => 'client'
                ]);
                $this->info("Created test user: {$user->name}");
            }

            $success = false;

            switch ($type) {
                case 'welcome':
                    $success = EmailHelper::sendWelcomeEmail($user);
                    break;
                
                case 'custom':
                    $data = [
                        'greeting' => 'Hola desde el sistema de pruebas!',
                        'message' => 'Este es un correo de prueba del sistema de notificaciones.',
                        'alertType' => 'info',
                        'content' => '<p>Características del sistema:</p><ul><li>Correos HTML responsivos</li><li>Plantillas personalizables</li><li>Envio de PDFs adjuntos</li></ul>',
                        'actionUrl' => 'https://example.com',
                        'actionText' => 'Visitar Sitio',
                        'additionalInfo' => [
                            'Sistema desarrollado con Laravel',
                            'Plantillas con Tailwind CSS',
                            'Soporte para múltiples tipos de alerta'
                        ],
                        'closing' => '¡Gracias por probar nuestro sistema!'
                    ];
                    $success = EmailHelper::sendNotificationEmail(
                        $email,
                        'Correo de Prueba del Sistema 📧',
                        $data,
                        $user
                    );
                    break;
                
                default:
                    $this->error("Tipo de correo no válido. Opciones: welcome, custom");
                    return 1;
            }

            if ($success) {
                $this->info("✅ {$type} email sent successfully to {$email}");
            } else {
                $this->error("❌ Failed to send {$type} email");
                return 1;
            }

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }
}