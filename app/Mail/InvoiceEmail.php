<?php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceEmail extends Mailable
{

    public Pedido $pedido;

    /**
     * Create a new message instance.
     */
    public function __construct(Pedido $pedido)
    {
        $this->pedido = $pedido;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Factura de tu pedido #' . $this->pedido->id . ' - CafeTech',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.invoice',
            with: [
                'pedido' => $this->pedido,
                'cliente' => $this->pedido->user,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        // Cargar relaciones necesarias para el PDF
        $this->pedido->load('detalles.producto', 'user');
        
        // Generar el PDF
        $pdf = Pdf::loadView('pdf.invoice', [
            'pedido' => $this->pedido,
        ]);
        
        return [
            Attachment::fromData(fn () => $pdf->output(), 'factura_pedido_' . $this->pedido->id . '.pdf')
                ->withMime('application/pdf'),
        ];
    }
}
