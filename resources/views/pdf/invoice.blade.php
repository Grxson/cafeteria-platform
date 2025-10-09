<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura de Pedido #{{ $pedido->id }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.5;
            color: #374151;
            margin: 0;
            padding: 15px 30px;
            font-size: 12px;
            background-color: #ffffff;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
        }
        
        .logo-section {
            margin-bottom: 20px;
        }
        
        .logo {
            font-size: 32px;
            color: #f59e0b;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .coffee-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #f59e0b;
            border-radius: 8px 8px 0 0;
            position: relative;
            margin: 0 auto 10px auto;
        }
        
        .coffee-icon::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 12px;
            background: #8b4513;
            border-radius: 50%;
        }
        
        .coffee-icon::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 4px;
            background: #8b4513;
            border-radius: 2px;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #f59e0b;
            margin: 0;
        }
        
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #374151;
            margin: 20px 0 5px 0;
            text-transform: uppercase;
        }
        
        .invoice-number {
            font-size: 18px;
            color: #6b7280;
            margin: 5px 0;
        }
        
        .system-info {
            background: #fef3c7;
            padding: 12px;
            border-radius: 8px;
            margin: 20px auto;
            text-align: center;
            max-width: 400px;
        }
        
        .system-title {
            font-weight: bold;
            color: #374151;
            margin: 0 0 5px 0;
            font-size: 14px;
        }
        
        .system-subtitle {
            font-size: 11px;
            color: #6b7280;
            margin: 0;
        }
        
        .info-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
            border: 1px solid #e5e7eb;
        }
        
        .info-grid {
            display: table;
            width: 100%;
        }
        
        .info-item {
            display: table-row;
        }
        
        .info-label {
            display: table-cell;
            font-weight: bold;
            color: #374151;
            padding-right: 15px;
            width: 140px;
            font-size: 13px;
        }
        
        .info-value {
            display: table-cell;
            color: #6b7280;
            font-size: 13px;
        }
        
        .shipping-section {
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #f59e0b;
        }
        
        .shipping-title {
            font-weight: bold;
            color: #374151;
            margin: 0 0 8px 0;
            font-size: 13px;
        }
        
        .shipping-address {
            color: #6b7280;
            font-size: 12px;
            margin: 0;
        }
        
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .products-header {
            background: #f59e0b;
            color: white;
        }
        
        .products-header th {
            padding: 15px 12px;
            text-align: center;
            font-weight: bold;
            font-size: 13px;
        }
        
        .products-header th:first-child {
            text-align: left;
        }
        
        .products-header th:last-child {
            text-align: right;
        }
        
        .products-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 13px;
        }
        
        .products-table td:first-child {
            text-align: left;
            font-weight: 500;
        }
        
        .products-table td:nth-child(2),
        .products-table td:nth-child(3) {
            text-align: center;
        }
        
        .products-table td:last-child {
            text-align: right;
            font-weight: 500;
        }
        
        .total-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin-top: 25px;
            text-align: right;
            border: 1px solid #f59e0b;
        }
        
        .total-label {
            font-weight: bold;
            color: #374151;
            font-size: 15px;
            text-transform: uppercase;
            margin: 0 0 8px 0;
        }
        
        .total-amount {
            font-size: 28px;
            font-weight: bold;
            color: #f59e0b;
            margin: 0;
        }
        
        .confirmation-section {
            background: #d1fae5;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            text-align: center;
            border: 1px solid #10b981;
        }
        
        .confirmation-message {
            color: #065f46;
            font-weight: 500;
            margin: 0;
            font-size: 14px;
        }
        
        .footer {
            margin-top: 35px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
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
        
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <!-- Header con logo y título -->
    <div class="header">
        <div class="logo-section">
            <div class="coffee-icon"></div>
            <div class="company-name">CafeTech</div>
        </div>
        <div class="invoice-title">FACTURA DE COMPRA</div>
        <div class="invoice-number">Pedido #{{ $pedido->id }}</div>
    </div>

    <!-- Información del sistema -->
    <div class="system-info">
        <div class="system-title">CafeTech - Sistema de Gestión de Cafetería</div>
        <div class="system-subtitle">Factura generada el {{ $pedido->created_at->format('d/m/Y H:i') }}</div>
    </div>

    <!-- Información del cliente y pedido -->
    <div class="info-section">
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Cliente:</div>
                <div class="info-value">{{ $pedido->user->name }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Email:</div>
                <div class="info-value">{{ $pedido->user->email }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Fecha de Pedido:</div>
                <div class="info-value">{{ $pedido->created_at->format('d/m/Y H:i') }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Estado:</div>
                <div class="info-value">
                    <span class="status-badge status-{{ $pedido->estado }}">
                        {{ strtoupper($pedido->estado) }}
                    </span>
                </div>
            </div>
            @if($pedido->id_transaccion_pago)
            <div class="info-item">
                <div class="info-label">ID Transacción:</div>
                <div class="info-value">{{ $pedido->id_transaccion_pago }}</div>
            </div>
            @endif
        </div>
    </div>

    <!-- Dirección de envío -->
    @if($pedido->direccion_envio)
    <div class="shipping-section">
        <div class="shipping-title">📄 Dirección de Envío:</div>
        <div class="shipping-address">{{ $pedido->direccion_envio }}@if($pedido->user->telefono) (Tel: {{ $pedido->user->telefono }})@endif</div>
    </div>
    @endif

    <!-- Tabla de productos -->
    <table class="products-table">
        <thead class="products-header">
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pedido->detalles as $detalle)
                <tr>
                    <td>{{ $detalle->producto->nombre }}</td>
                    <td>{{ $detalle->cantidad }}</td>
                    <td>{{ \App\Helpers\NumberHelper::formatCurrency($detalle->precio_unitario) }}</td>
                    <td>{{ \App\Helpers\NumberHelper::formatCurrency($detalle->cantidad * $detalle->precio_unitario) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Total del pedido -->
    <div class="total-section">
        <div class="total-label">TOTAL DEL PEDIDO</div>
        <div class="total-amount">{{ \App\Helpers\NumberHelper::formatCurrency($pedido->total) }}</div>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Mensaje de confirmación -->
    <div class="confirmation-section">
        <div class="confirmation-message">¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.</div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Este es un comprobante de compra generado automáticamente por CafeTech.</p>
        <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
        <p><strong>CafeTech</strong></p>
        <p>Sistema de Gestión de Cafetería</p>
        <p>Factura generada el {{ $pedido->created_at->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>