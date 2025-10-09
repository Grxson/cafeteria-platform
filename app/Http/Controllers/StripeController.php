<?php

namespace App\Http\Controllers;

use App\Helpers\EmailHelper;
use App\Helpers\NumberHelper;
use App\Models\Carrito;
use App\Models\CarritoProducto;
use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Crear sesión de checkout para el carrito
     */
    public function createCheckoutSession(Request $request)
    {
        try {
            $user = Auth::user();
            $carrito = Carrito::where('user_id', $user->id)->first();

            if (!$carrito || $carrito->productos->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay productos en el carrito'
                ], 400);
            }

            // Obtener dirección de envío del metadata
            $direccionEnvio = $request->input('direccion_envio', '');
            
            // Formatear la dirección usando el helper
            $direccionFormateada = NumberHelper::formatDireccionEnvio($direccionEnvio);

            // Crear los items de Stripe
            $lineItems = [];
            foreach ($carrito->productos as $carritoProducto) {
                $producto = $carritoProducto->producto;
                
                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'mxn',
                        'product_data' => [
                            'name' => $producto->nombre,
                            'description' => $producto->descripcion ? substr($producto->descripcion, 0, 100) : null,
                            'images' => $producto->imagen_principal ? [asset('storage/' . $producto->imagen_principal)] : [],
                        ],
                        'unit_amount' => (int) ($carritoProducto->precio_unitario * 100), // Convertir a centavos
                    ],
                    'quantity' => $carritoProducto->cantidad,
                ];
            }

            // Crear la sesión de Stripe
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('clientes.carrito'),
                'metadata' => [
                    'user_id' => $user->id,
                    'carrito_id' => $carrito->id,
                    'direccion_envio' => $direccionFormateada,
                ],
                'customer_email' => $user->email,
            ]);

            return response()->json([
                'success' => true,
                'checkout_url' => $session->url
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating checkout session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago'
            ], 500);
        }
    }

    /**
     * Crear sesión de checkout para compra directa
     */
    public function createDirectCheckoutSession(Request $request)
    {
        try {
            $user = Auth::user();
            $productoId = $request->input('producto_id');
            $cantidad = $request->input('cantidad', 1);
            $direccionEnvio = $request->input('direccion_envio', []);

            // Validar producto
            $producto = Producto::find($productoId);
            if (!$producto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            // Validar stock
            if ($producto->stock < $cantidad) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay suficiente stock disponible'
                ], 400);
            }

            // Formatear la dirección usando el helper
            $direccionFormateada = NumberHelper::formatDireccionEnvio($direccionEnvio);

            // Crear el item de Stripe
            $lineItems = [[
                'price_data' => [
                    'currency' => 'mxn',
                    'product_data' => [
                        'name' => $producto->nombre,
                        'description' => $producto->descripcion ? substr($producto->descripcion, 0, 100) : null,
                        'images' => $producto->imagen_principal ? [asset('storage/' . $producto->imagen_principal)] : [],
                    ],
                    'unit_amount' => (int) ($producto->precio * 100), // Convertir a centavos
                ],
                'quantity' => $cantidad,
            ]];

            // Crear la sesión de Stripe
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('clientes.producto.show', $producto->id),
                'metadata' => [
                    'user_id' => $user->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $producto->precio,
                    'direccion_envio' => $direccionFormateada,
                    'tipo_compra' => 'directa',
                ],
                'customer_email' => $user->email,
            ]);

            return response()->json([
                'success' => true,
                'checkout_url' => $session->url
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating direct checkout session: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago'
            ], 500);
        }
    }

    /**
     * Manejar el éxito del pago
     */
    public function handleSuccess(Request $request)
    {
        try {
            $sessionId = $request->get('session_id');
            
            if (!$sessionId) {
                return redirect()->route('clientes.tienda')->with('error', 'Sesión de pago no válida');
            }

            // Recuperar la sesión de Stripe
            $session = Session::retrieve($sessionId);
            
            if (!$session || $session->payment_status !== 'paid') {
                return redirect()->route('clientes.tienda')->with('error', 'Pago no completado');
            }

            $user = User::find($session->metadata->user_id);
            if (!$user) {
                return redirect()->route('clientes.tienda')->with('error', 'Usuario no encontrado');
            }

            // Determinar el tipo de compra
            $tipoCompra = $session->metadata->tipo_compra ?? 'carrito';
            
            if ($tipoCompra === 'directa') {
                // Procesar compra directa
                $resultado = $this->processDirectPayment($session, $user);
            } else {
                // Procesar compra del carrito
                $resultado = $this->processCarritoPayment($session, $user);
            }

            if ($resultado['success']) {
                return redirect()->route('clientes.pedidos')->with([
                    'success' => $resultado['message'],
                    'invoice_sent' => $resultado['invoice_sent']
                ]);
            } else {
                return redirect()->route('clientes.tienda')->with('error', $resultado['message']);
            }

        } catch (\Exception $e) {
            Log::error('Error handling payment success: ' . $e->getMessage());
            return redirect()->route('clientes.tienda')->with('error', 'Error al procesar el pago');
        }
    }

    /**
     * Procesar pago del carrito
     */
    private function processCarritoPayment($session, $user)
    {
        try {
            $carrito = Carrito::where('user_id', $user->id)->first();
            
            if (!$carrito || $carrito->productos->isEmpty()) {
                return [
                    'success' => false,
                    'message' => 'Carrito no encontrado'
                ];
            }

            // Calcular total
            $total = $carrito->productos->sum(function ($item) {
                return $item->precio_unitario * $item->cantidad;
            });

            // Crear pedido
            $pedido = Pedido::create([
                'user_id' => $user->id,
                'total' => $total,
                'estado' => 'completado',
                'direccion_envio' => $session->metadata->direccion_envio ?? '',
                'id_transaccion_pago' => $session->payment_intent,
            ]);

            // Crear detalles del pedido
            foreach ($carrito->productos as $carritoProducto) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $carritoProducto->producto_id,
                    'cantidad' => $carritoProducto->cantidad,
                    'precio_unitario' => $carritoProducto->precio_unitario,
                ]);

                // Actualizar stock
                $producto = $carritoProducto->producto;
                $producto->decrement('stock', $carritoProducto->cantidad);
            }

            // Vaciar carrito
            $carrito->productos()->delete();

            // Cargar relaciones necesarias para el correo
            $pedido->load(['detalles.producto', 'user']);
            
            // Enviar correo con la factura
            $emailSent = EmailHelper::sendInvoiceEmail($pedido);
            
            // Log del resultado del envío de correo
            if ($emailSent) {
                Log::info("Correo de factura enviado exitosamente para pedido #{$pedido->id} a {$pedido->user->email}");
            } else {
                Log::error("Error enviando correo de factura para pedido #{$pedido->id}");
            }

            return [
                'success' => true,
                'message' => '¡Pago procesado exitosamente! Tu pedido #' . $pedido->id . ' ha sido creado.',
                'invoice_sent' => $emailSent ? 'Se ha enviado un correo con la factura y detalles de tu pedido.' : 'Hubo un problema al enviar el correo de factura, pero tu pedido fue procesado correctamente.'
            ];

        } catch (\Exception $e) {
            Log::error('Error processing cart payment: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al procesar el pedido'
            ];
        }
    }

    /**
     * Procesar pago directo
     */
    private function processDirectPayment($session, $user)
    {
        try {
            $productoId = $session->metadata->producto_id;
            $cantidad = (int) $session->metadata->cantidad;
            $precioUnitario = (float) $session->metadata->precio_unitario;
            $total = $precioUnitario * $cantidad;

            // Validar producto
            $producto = Producto::find($productoId);
            if (!$producto) {
                return [
                    'success' => false,
                    'message' => 'Producto no encontrado'
                ];
            }

            // Crear pedido
            $pedido = Pedido::create([
                'user_id' => $user->id,
                'total' => $total,
                'estado' => 'completado',
                'direccion_envio' => $session->metadata->direccion_envio ?? '',
                'id_transaccion_pago' => $session->payment_intent,
            ]);

            // Crear detalle del pedido
            DetallePedido::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $productoId,
                'cantidad' => $cantidad,
                'precio_unitario' => $precioUnitario,
            ]);

            // Actualizar stock
            $producto->decrement('stock', $cantidad);

            // Cargar relaciones necesarias para el correo
            $pedido->load(['detalles.producto', 'user']);
            
            // Enviar correo con la factura
            $emailSent = EmailHelper::sendInvoiceEmail($pedido);
            
            // Log del resultado del envío de correo
            if ($emailSent) {
                Log::info("Correo de factura enviado exitosamente para pedido #{$pedido->id} a {$pedido->user->email}");
            } else {
                Log::error("Error enviando correo de factura para pedido #{$pedido->id}");
            }

            return [
                'success' => true,
                'message' => '¡Pago procesado exitosamente! Tu pedido #' . $pedido->id . ' ha sido creado.',
                'invoice_sent' => $emailSent ? 'Se ha enviado un correo con la factura y detalles de tu pedido.' : 'Hubo un problema al enviar el correo de factura, pero tu pedido fue procesado correctamente.'
            ];

        } catch (\Exception $e) {
            Log::error('Error processing direct payment: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al procesar el pedido'
            ];
        }
    }
}