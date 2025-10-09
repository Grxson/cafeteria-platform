<?php

namespace App\Console\Commands;

use App\Mail\InvoiceEmail;
use App\Models\Pedido;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email} {--pedido=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email sending functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $pedidoId = $this->option('pedido');

        $this->info("Testing email sending to: {$email}");

        try {
            // Buscar el pedido
            $pedido = Pedido::with(['detalles.producto', 'user'])->find($pedidoId);
            
            if (!$pedido) {
                $this->error("Pedido #{$pedidoId} not found");
                return 1;
            }

            $this->info("Found pedido #{$pedido->id} for user: {$pedido->user->name}");

            // Enviar el correo
            Mail::to($email)->send(new InvoiceEmail($pedido));

            $this->info("✅ Email sent successfully to {$email}");
            $this->info("Check your mail server logs or inbox for the email");

        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
            return 1;
        }

        return 0;
    }
}