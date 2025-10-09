<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura de Pedido #{{ $pedido->id }}</title>
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* Main styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Mobile styles */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            
            .mobile-padding {
                padding: 15px !important;
            }
            
            .mobile-text-center {
                text-align: center !important;
            }
            
            .mobile-full-width {
                width: 100% !important;
            }
            
            .mobile-stack {
                display: block !important;
                width: 100% !important;
            }
            
            .mobile-hide {
                display: none !important;
            }
            
            .mobile-font-large {
                font-size: 24px !important;
                line-height: 1.2 !important;
            }
            
            .mobile-font-medium {
                font-size: 18px !important;
                line-height: 1.3 !important;
            }
        }

        /* Tablet styles */
        @media only screen and (min-width: 601px) and (max-width: 768px) {
            .email-container {
                max-width: 550px !important;
            }
            
            .tablet-padding {
                padding: 20px !important;
            }
        }
        .header {
            background: #f59e0b; /* Fallback para clientes que no soportan gradientes */
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 25px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
            /* Sombra para mejor contraste */
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Estilos específicos para el icono */
        .coffee-icon {
            font-size: 36px !important;
            margin-bottom: 10px !important;
            display: inline-block !important;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
            /* Asegurar que se vea en todos los fondos */
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        .content {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-top: none;
            padding: 30px 25px;
        }
        
        /* Header responsive */
        @media only screen and (max-width: 600px) {
            .header {
                padding: 20px 15px !important;
            }
            
            .header h1 {
                font-size: 28px !important;
                margin: 0 0 10px 0 !important;
            }
            
            .header h2 {
                font-size: 18px !important;
                margin: 0 !important;
                font-weight: 400 !important;
            }
        }
        
        /* Content responsive */
        @media only screen and (max-width: 600px) {
            .content {
                padding: 20px 15px !important;
            }
        }
        .order-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        /* Order info responsive */
        @media only screen and (max-width: 600px) {
            .order-info {
                padding: 15px !important;
                margin: 15px 0 !important;
            }
            
            .order-info h3 {
                font-size: 16px !important;
                margin: 0 0 15px 0 !important;
            }
            
            .order-info p {
                font-size: 14px !important;
                margin: 8px 0 !important;
            }
        }
        
        /* Product table styles */
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
        }
        
        .product-table th,
        .product-table td {
            padding: 12px 8px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        
        .product-table th {
            background: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        
        /* Mobile table styles */
        @media only screen and (max-width: 600px) {
            .product-table {
                font-size: 12px !important;
            }
            
            .product-table th,
            .product-table td {
                padding: 8px 4px !important;
                font-size: 12px !important;
            }
            
            .product-table th:nth-child(2),
            .product-table th:nth-child(3),
            .product-table td:nth-child(2),
            .product-table td:nth-child(3) {
                text-align: center !important;
            }
            
            .product-table th:nth-child(4),
            .product-table td:nth-child(4) {
                text-align: right !important;
            }
        }
        .total-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .total-section h3 {
            margin: 0 0 15px 0;
            color: #92400e;
            font-size: 18px;
        }
        
        .total-amount {
            font-size: 28px;
            font-weight: bold;
            color: #92400e;
            margin: 0;
        }
        
        /* Total section responsive */
        @media only screen and (max-width: 600px) {
            .total-section {
                padding: 15px !important;
                margin: 15px 0 !important;
            }
            
            .total-section h3 {
                font-size: 16px !important;
                margin: 0 0 10px 0 !important;
            }
            
            .total-amount {
                font-size: 24px !important;
            }
        }
        
        .footer {
            background: #f3f4f6;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
            color: #6b7280;
        }
        
        /* Footer responsive */
        @media only screen and (max-width: 600px) {
            .footer {
                padding: 15px !important;
                font-size: 12px !important;
            }
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed {
            background: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        /* Mobile visibility controls */
        @media only screen and (max-width: 600px) {
            .mobile-hide {
                display: none !important;
            }
            
            .mobile-stack {
                display: block !important;
            }
        }
        
        @media only screen and (min-width: 601px) {
            .mobile-stack {
                display: none !important;
            }
            
            .mobile-hide {
                display: table !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa;">
    <!-- Wrapper table for email clients -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <div class="email-container">
                    <!-- Header -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td class="header">
                                <div class="coffee-icon">☕</div>
                                <h1 style="margin: 0; font-size: 32px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">CafeTech</h1>
                                <h2 style="margin: 10px 0 0 0; font-size: 20px; font-weight: normal; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Factura de Pedido #{{ $pedido->id }}</h2>
                            </td>
                        </tr>
                    </table>

                    <!-- Content -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td class="content">
        <p>Hola <strong>{{ $pedido->user->name }}</strong>,</p>
        
        <p>¡Gracias por tu compra! Aquí tienes los detalles de tu pedido:</p>

        <div class="order-info">
            <h3>📋 Información del Pedido</h3>
            <p><strong>Número de Pedido:</strong> #{{ $pedido->id }}</p>
            <p><strong>Fecha:</strong> {{ $pedido->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Estado:</strong> 
                <span class="status-badge status-{{ $pedido->estado }}">
                    {{ ucfirst($pedido->estado) }}
                </span>
            </p>
            @if($pedido->direccion_envio)
                <p><strong>Dirección de Envío:</strong> {{ $pedido->direccion_envio }}</p>
            @endif
            @if($pedido->id_transaccion_pago)
                <p><strong>ID de Transacción:</strong> {{ $pedido->id_transaccion_pago }}</p>
            @endif
        </div>

        <h3 style="margin: 25px 0 15px 0; font-size: 18px; color: #374151;">🛒 Productos Pedidos</h3>
        
        <!-- Desktop table -->
        <table class="product-table mobile-hide" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr>
                    <th style="padding: 12px 8px; background: #f3f4f6; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb;">Producto</th>
                    <th style="padding: 12px 8px; background: #f3f4f6; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; text-align: center;">Cantidad</th>
                    <th style="padding: 12px 8px; background: #f3f4f6; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; text-align: center;">Precio Unitario</th>
                    <th style="padding: 12px 8px; background: #f3f4f6; font-weight: bold; color: #374151; border-bottom: 1px solid #e5e7eb; text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pedido->detalles as $detalle)
                    <tr>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb;">{{ $detalle->producto->nombre }}</td>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">{{ $detalle->cantidad }}</td>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->precio_unitario) }}</td>
                        <td style="padding: 12px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        
        <!-- Mobile cards -->
        <div class="mobile-stack" style="display: none;">
            @foreach($pedido->detalles as $detalle)
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <h4 style="margin: 0 0 10px 0; font-size: 16px; color: #374151;">{{ $detalle->producto->nombre }}</h4>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td style="padding: 5px 0; font-size: 14px; color: #6b7280;">Cantidad:</td>
                            <td style="padding: 5px 0; font-size: 14px; text-align: right; font-weight: bold;">{{ $detalle->cantidad }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; font-size: 14px; color: #6b7280;">Precio Unitario:</td>
                            <td style="padding: 5px 0; font-size: 14px; text-align: right; font-weight: bold;">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->precio_unitario) }}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb;">Subtotal:</td>
                            <td style="padding: 5px 0; font-size: 14px; text-align: right; font-weight: bold; border-top: 1px solid #e5e7eb;">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario) }}</td>
                        </tr>
                    </table>
                </div>
            @endforeach
        </div>

        <div class="total-section">
            <h3>💰 Total del Pedido</h3>
            <p class="total-amount">
                {{ \App\Helpers\NumberHelper::formatCurrency($pedido->total) }}
            </p>
        </div>

        <p style="margin: 20px 0; font-size: 16px; line-height: 1.6;">Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        
        <p style="margin: 15px 0; font-size: 16px; line-height: 1.6;">¡Esperamos que disfrutes tus productos!</p>
        
        <p style="margin: 20px 0 0 0; font-size: 16px; line-height: 1.6;">Saludos,<br>El equipo de CafeTech ☕</p>
                            </td>
                        </tr>
                    </table>

                    <!-- Footer -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                            <td class="footer">
                                <p style="margin: 0 0 10px 0;">Este es un correo automático. Por favor, no respondas a este mensaje.</p>
                                <p style="margin: 0;">© {{ date('Y') }} CafeTech. Todos los derechos reservados.</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>