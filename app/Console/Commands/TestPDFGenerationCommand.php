<?php

namespace App\Console\Commands;

use App\Models\Pedido;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestPDFGenerationCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:pdf {pedido-id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test PDF generation for a specific pedido';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pedidoId = $this->argument('pedido-id');

        $this->info("📄 Testing PDF generation for pedido #{$pedidoId}");

        try {
            // Buscar el pedido
            $pedido = Pedido::with(['detalles.producto', 'user'])->find($pedidoId);
            if (!$pedido) {
                $this->error("Pedido #{$pedidoId} not found");
                return 1;
            }

            $this->info("📋 Pedido Information:");
            $this->info("   ID: #{$pedido->id}");
            $this->info("   Cliente: {$pedido->user->name} ({$pedido->user->email})");
            $this->info("   Total: $" . number_format($pedido->total, 2) . " MXN");
            $this->info("   Estado: {$pedido->estado}");
            $this->info("   Productos: " . $pedido->detalles->count());

            // Generar el PDF
            $this->info("\n📄 Generating PDF...");
            $pdf = Pdf::loadView('pdf.invoice', [
                'pedido' => $pedido,
            ]);

            // Configurar el PDF
            $pdf->setPaper('A4', 'portrait');
            $pdf->setOptions([
                'defaultFont' => 'Arial',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => false,
            ]);

            // Guardar el PDF temporalmente
            $filename = "factura_pedido_{$pedido->id}_test.pdf";
            $filepath = storage_path("app/temp/{$filename}");
            
            // Crear directorio si no existe
            if (!is_dir(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            $pdf->save($filepath);

            $this->info("✅ PDF generated successfully!");
            $this->info("📁 File saved to: {$filepath}");
            $this->info("📊 File size: " . $this->formatBytes(filesize($filepath)));

            // Mostrar información del PDF
            $this->info("\n📋 PDF Features:");
            $this->info("   ✅ Logo de la empresa (🍰)");
            $this->info("   ✅ Título de la factura");
            $this->info("   ✅ Datos de la empresa");
            $this->info("   ✅ Datos del cliente");
            $this->info("   ✅ Detalles del pedido");
            $this->info("   ✅ Tabla de productos");
            $this->info("   ✅ Total destacado");
            $this->info("   ✅ Footer con información");
            $this->info("   ✅ Formato mexicano de moneda");

            // Opción para abrir el PDF
            if ($this->confirm('¿Quieres abrir el PDF para revisarlo?', true)) {
                $this->info("🌐 Opening PDF...");
                $this->info("📁 File location: {$filepath}");
                
                // En Linux, intentar abrir con el visor por defecto
                if (PHP_OS_FAMILY === 'Linux') {
                    exec("xdg-open '{$filepath}' 2>/dev/null &");
                    $this->info("📖 PDF should open in your default viewer");
                } else {
                    $this->info("📖 Please open the file manually: {$filepath}");
                }
            }

            // Limpiar archivo temporal después de 10 segundos
            $this->info("\n🧹 File will be automatically cleaned up in 10 seconds...");
            sleep(10);
            
            if (file_exists($filepath)) {
                unlink($filepath);
                $this->info("✅ Temporary file cleaned up");
            }

        } catch (\Exception $e) {
            $this->error("❌ Error generating PDF: " . $e->getMessage());
            $this->error("Stack trace: " . $e->getTraceAsString());
            return 1;
        }

        return 0;
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($size, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $size >= 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, $precision) . ' ' . $units[$i];
    }
}