<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura de Pedido #{{ $pedido->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f59e0b;
        }
        
        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #f59e0b;
            margin: 10px 0;
        }
        
        .invoice-number {
            font-size: 20px;
            color: #666;
            margin: 5px 0;
        }
        
        .invoice-subtitle {
            font-size: 14px;
            color: #888;
            margin: 5px 0;
        }
        
        .company-info {
            margin-bottom: 30px;
        }
        
        .customer-info {
            background: #f9fafb;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .order-details {
            background: #fef3c7;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .product-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        .product-table th,
        .product-table td {
            padding: 8px;
            text-align: left;
            border: 1px solid #e5e7eb;
        }
        
        .product-table th {
            background: #f3f4f6;
            font-weight: bold;
        }
        
        .total-section {
            background: #f59e0b;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: right;
        }
        
        .total-amount {
            font-size: 24px;
            font-weight: bold;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 10px;
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
        
        .text-center {
            text-align: center;
        }
        
        .text-right {
            text-align: right;
        }
        
        .mb-20 {
            margin-bottom: 20px;
        }
        
        .logo {
            font-size: 36px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <!-- Header con logo y título -->
    <div class="header">
        <div class="logo">☕</div>
        <div class="invoice-title">CafeTech</div>
        <div class="invoice-subtitle">Tu lugar favorito para el mejor café</div>
        <div class="invoice-number">FACTURA #{{ $pedido->id }}</div>
    </div>

    <!-- Información de la empresa y cliente -->
    <table width="100%" cellpadding="0" cellspacing="0" class="mb-20">
        <tr>
            <td width="50%" valign="top">
                <div class="company-info">
                    <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px;">Datos de la Empresa</h3>
                    <p style="margin: 5px 0;"><strong>Cafetería</strong></p>
                    <p style="margin: 5px 0;">Dirección: Av. Principal 123</p>
                    <p style="margin: 5px 0;">Ciudad, Estado 12345</p>
                    <p style="margin: 5px 0;">Teléfono: (555) 123-4567</p>
                    <p style="margin: 5px 0;">Email: contacto@cafeteria.com</p>
                </div>
            </td>
            <td width="50%" valign="top">
                <div class="customer-info">
                    <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px;">Datos del Cliente</h3>
                    <p style="margin: 5px 0;"><strong>{{ $pedido->user->name }}</strong></p>
                    <p style="margin: 5px 0;">Email: {{ $pedido->user->email }}</p>
                    @if($pedido->direccion_envio)
                        <p style="margin: 5px 0;">Dirección: {{ $pedido->direccion_envio }}</p>
                    @endif
                </div>
            </td>
        </tr>
    </table>

    <!-- Detalles del pedido -->
    <div class="order-details">
        <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px;">Detalles del Pedido</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td width="50%"><strong>Fecha:</strong> {{ $pedido->created_at->format('d/m/Y H:i') }}</td>
                <td width="50%"><strong>Estado:</strong> 
                    <span class="status-badge status-{{ $pedido->estado }}">
                        {{ ucfirst($pedido->estado) }}
                    </span>
                </td>
            </tr>
            @if($pedido->id_transaccion_pago)
                <tr>
                    <td colspan="2" style="padding-top: 5px;">
                        <strong>ID de Transacción:</strong> {{ $pedido->id_transaccion_pago }}
                    </td>
                </tr>
            @endif
        </table>
    </div>

    <!-- Productos -->
    <h3 style="margin: 20px 0 10px 0; color: #374151; font-size: 16px;">Productos</h3>
    <table class="product-table">
        <thead>
            <tr>
                <th style="width: 40%;">Producto</th>
                <th style="width: 15%; text-align: center;">Cantidad</th>
                <th style="width: 20%; text-align: center;">Precio Unitario</th>
                <th style="width: 25%; text-align: right;">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pedido->detalles as $detalle)
                <tr>
                    <td>{{ $detalle->producto->nombre }}</td>
                    <td class="text-center">{{ $detalle->cantidad }}</td>
                    <td class="text-center">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->precio_unitario) }}</td>
                    <td class="text-right">{{ \App\Helpers\NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Total -->
    <div class="total-section">
        <div class="total-amount">
            Total: {{ \App\Helpers\NumberHelper::formatCurrency($pedido->total) }}
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p style="margin: 5px 0;"><strong>¡Gracias por tu compra!</strong></p>
        <p style="margin: 5px 0;">Para cualquier consulta, contacta con nosotros en contacto@cafeteria.com</p>
        <p style="margin: 5px 0;">© {{ date('Y') }} CafeTech. Todos los derechos reservados.</p>
    </div>
</body>
</html>