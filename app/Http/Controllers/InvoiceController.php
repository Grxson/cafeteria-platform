<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Helpers\NumberHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Generar y descargar factura PDF
     */
    public function downloadPDF($pedidoId)
    {
        $user = Auth::user();
        
        // Verificar que el pedido pertenece al usuario autenticado
        $pedido = Pedido::with(['detalles.producto', 'user'])
            ->where('id', $pedidoId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Preparar datos para la factura
        $facturaData = [
            'pedido' => $pedido,
            'cliente' => $pedido->user,
            'productos' => $pedido->detalles->map(function ($detalle) {
                return [
                    'nombre' => $detalle->producto->nombre,
                    'cantidad' => $detalle->cantidad,
                    'precio_unitario' => $detalle->precio_unitario,
                    'precio_unitario_formatted' => NumberHelper::formatCurrency($detalle->precio_unitario),
                    'subtotal' => $detalle->cantidad * $detalle->precio_unitario,
                    'subtotal_formatted' => NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario),
                ];
            }),
            'total_formatted' => NumberHelper::formatCurrency($pedido->total),
            'fecha_formatted' => $pedido->created_at->format('d/m/Y H:i'),
        ];

        // Generar PDF
        $pdf = Pdf::loadView('pdf.invoice', $facturaData);
        
        // Configurar el nombre del archivo
        $filename = 'Factura_CafeTech_Pedido_' . $pedido->id . '.pdf';
        
        // Descargar el PDF
        return $pdf->download($filename);
    }

    /**
     * Ver factura PDF en el navegador
     */
    public function viewPDF($pedidoId)
    {
        $user = Auth::user();
        
        // Verificar que el pedido pertenece al usuario autenticado
        $pedido = Pedido::with(['detalles.producto', 'user'])
            ->where('id', $pedidoId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        // Preparar datos para la factura
        $facturaData = [
            'pedido' => $pedido,
            'cliente' => $pedido->user,
            'productos' => $pedido->detalles->map(function ($detalle) {
                return [
                    'nombre' => $detalle->producto->nombre,
                    'cantidad' => $detalle->cantidad,
                    'precio_unitario' => $detalle->precio_unitario,
                    'precio_unitario_formatted' => NumberHelper::formatCurrency($detalle->precio_unitario),
                    'subtotal' => $detalle->cantidad * $detalle->precio_unitario,
                    'subtotal_formatted' => NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario),
                ];
            }),
            'total_formatted' => NumberHelper::formatCurrency($pedido->total),
            'fecha_formatted' => $pedido->created_at->format('d/m/Y H:i'),
        ];

        // Generar PDF
        $pdf = Pdf::loadView('pdf.invoice', $facturaData);
        
        // Mostrar el PDF en el navegador
        return $pdf->stream('Factura_CafeTech_Pedido_' . $pedido->id . '.pdf');
    }
}
