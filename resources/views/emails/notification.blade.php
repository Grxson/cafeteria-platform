<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Notificación' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-top: none;
            padding: 30px;
        }
        .footer {
            background: #f3f4f6;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            background: #f59e0b;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 15px 0;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .alert-info {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            color: #1e40af;
        }
        .alert-success {
            background: #d1fae5;
            border: 1px solid #6ee7b7;
            color: #065f46;
        }
        .alert-warning {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍰 Cafetería</h1>
        <h2>{{ $subject ?? 'Notificación Importante' }}</h2>
    </div>

    <div class="content">
        @if(isset($greeting))
            <p>{{ $greeting }}</p>
        @else
            <p>Hola <strong>{{ $user->name ?? 'Cliente' }}</strong>,</p>
        @endif

        @if(isset($message))
            <div class="alert alert-{{ $alertType ?? 'info' }}">
                {!! $message !!}
            </div>
        @endif

        @if(isset($content))
            {!! $content !!}
        @endif

        @if(isset($actionUrl) && isset($actionText))
            <div style="text-align: center;">
                <a href="{{ $actionUrl }}" class="button">{{ $actionText }}</a>
            </div>
        @endif

        @if(isset($additionalInfo))
            <p><strong>Información adicional:</strong></p>
            <ul>
                @foreach($additionalInfo as $info)
                    <li>{{ $info }}</li>
                @endforeach
            </ul>
        @endif

        @if(isset($closing))
            <p>{{ $closing }}</p>
        @else
            <p>¡Gracias por ser parte de nuestra comunidad!</p>
            <p>Saludos,<br>El equipo de Cafetería 🍰</p>
        @endif
    </div>

    <div class="footer">
        <p>Este es un correo automático. Por favor, no respondas a este mensaje.</p>
        <p>© {{ date('Y') }} Cafetería. Todos los derechos reservados.</p>
    </div>
</body>
</html>
