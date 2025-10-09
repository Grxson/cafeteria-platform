<?php

namespace App\Helpers;

use App\Mail\InvoiceEmail;
use App\Mail\NotificationEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class EmailHelper
{
    /**
     * Enviar correo de factura
     */
    public static function sendInvoiceEmail($pedido)
    {
        try {
            Mail::to($pedido->user->email)->send(new InvoiceEmail($pedido));
            return true;
        } catch (\Exception $e) {
            \Log::error('Error enviando correo de factura: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Enviar correo de notificación genérica
     */
    public static function sendNotificationEmail(
        string $email,
        string $subject,
        array $data = [],
        ?User $user = null
    ) {
        try {
            Mail::send('emails.notification', [
                'subject' => $subject,
                'greeting' => $data['greeting'] ?? null,
                'message' => $data['message'] ?? null,
                'alertType' => $data['alertType'] ?? 'info',
                'content' => $data['content'] ?? null,
                'actionUrl' => $data['actionUrl'] ?? null,
                'actionText' => $data['actionText'] ?? null,
                'additionalInfo' => $data['additionalInfo'] ?? null,
                'closing' => $data['closing'] ?? null,
                'user' => $user,
            ], function ($message) use ($email, $subject) {
                $message->to($email)->subject($subject);
            });
            return true;
        } catch (\Exception $e) {
            \Log::error('Error enviando correo de notificación: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Enviar correo de bienvenida
     */
    public static function sendWelcomeEmail(User $user)
    {
        $data = [
            'greeting' => "¡Bienvenido a nuestra cafetería, {$user->name}!",
            'message' => 'Tu cuenta ha sido creada exitosamente.',
            'alertType' => 'success',
            'content' => '<p>Ahora puedes:</p><ul><li>Explorar nuestra tienda</li><li>Realizar pedidos</li><li>Recibir ofertas especiales</li></ul>',
            'actionUrl' => route('clientes.tienda'),
            'actionText' => 'Ir a la Tienda',
            'closing' => '¡Esperamos que disfrutes de nuestros deliciosos productos!'
        ];

        return self::sendNotificationEmail($user->email, '¡Bienvenido a Cafetería! 🍰', $data, $user);
    }

    /**
     * Enviar correo de confirmación de pedido
     */
    public static function sendOrderConfirmationEmail($pedido)
    {
        $data = [
            'greeting' => "Hola {$pedido->user->name},",
            'message' => "Tu pedido #{$pedido->id} ha sido confirmado y está siendo procesado.",
            'alertType' => 'info',
            'content' => '<p>Detalles del pedido:</p><ul><li>Total: ' . \App\Helpers\NumberHelper::formatCurrency($pedido->total) . '</li><li>Estado: ' . ucfirst($pedido->estado) . '</li></ul>',
            'actionUrl' => route('clientes.pedidos'),
            'actionText' => 'Ver Mis Pedidos',
            'closing' => 'Te notificaremos cuando tu pedido esté listo.'
        ];

        return self::sendNotificationEmail($pedido->user->email, 'Pedido Confirmado - #' . $pedido->id, $data, $pedido->user);
    }

    /**
     * Enviar correo de actualización de estado de pedido
     */
    public static function sendOrderStatusUpdateEmail($pedido, string $newStatus, ?string $message = null)
    {
        $statusMessages = [
            'pendiente' => 'Tu pedido está siendo procesado.',
            'procesando' => 'Tu pedido está siendo preparado.',
            'enviado' => 'Tu pedido ha sido enviado.',
            'entregado' => '¡Tu pedido ha sido entregado!',
            'completado' => '¡Tu pedido ha sido completado exitosamente!',
            'cancelado' => 'Tu pedido ha sido cancelado.'
        ];

        $statusMessage = $message ?? ($statusMessages[$newStatus] ?? 'El estado de tu pedido ha sido actualizado.');

        $data = [
            'greeting' => "Hola {$pedido->user->name},",
            'message' => $statusMessage,
            'alertType' => $newStatus === 'cancelado' ? 'warning' : 'info',
            'content' => '<p>Detalles del pedido:</p><ul><li>Número: #' . $pedido->id . '</li><li>Nuevo estado: ' . ucfirst($newStatus) . '</li></ul>',
            'actionUrl' => route('clientes.pedidos'),
            'actionText' => 'Ver Mis Pedidos'
        ];

        return self::sendNotificationEmail($pedido->user->email, 'Actualización de Pedido #' . $pedido->id, $data, $pedido->user);
    }

    /**
     * Enviar correo de recordatorio de carrito abandonado
     */
    public static function sendAbandonedCartEmail(User $user, $carrito)
    {
        $data = [
            'greeting' => "Hola {$user->name},",
            'message' => 'Tienes productos esperando en tu carrito.',
            'alertType' => 'warning',
            'content' => '<p>No olvides completar tu compra para disfrutar de nuestros deliciosos productos.</p>',
            'actionUrl' => route('clientes.carrito'),
            'actionText' => 'Completar Compra',
            'closing' => '¡Los productos en tu carrito te están esperando!'
        ];

        return self::sendNotificationEmail($user->email, 'Tu carrito te está esperando 🛒', $data, $user);
    }
}
