<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - Cafetería</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .email-container {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        .header-content {
            position: relative;
            z-index: 1;
        }
        .logo {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header h1 {
            margin: 0;
            font-size: 1.8rem;
            font-weight: 600;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .content {
            padding: 40px 30px;
            background: #ffffff;
        }
        .greeting {
            font-size: 1.1rem;
            margin-bottom: 20px;
            color: #374151;
        }
        .message {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
            color: #92400e;
        }
        .message p {
            margin: 0;
            font-weight: 500;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
            text-decoration: none;
            color: white;
        }
        .expiry-info {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        }
        .security-notice {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #6b7280;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 0.9rem;
        }
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .footer .brand {
            color: #f59e0b;
            font-weight: 600;
        }
        .url-fallback {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
            font-family: monospace;
            font-size: 0.85rem;
            color: #6b7280;
        }
        .url-fallback strong {
            color: #374151;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 25px 15px;
            }
            .logo {
                font-size: 2rem;
            }
            .header h1 {
                font-size: 1.5rem;
            }
            .reset-button {
                padding: 12px 25px;
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <div class="logo">🍰</div>
                <h1>Cafetería</h1>
            </div>
        </div>

        <div class="content">
            <div class="greeting">
                <p>¡Hola <strong>{{ $user->name ?? 'Cliente' }}</strong>!</p>
            </div>

            <div class="message">
                <p>Recibiste este correo porque solicitaste restablecer la contraseña de tu cuenta en nuestra cafetería.</p>
            </div>

            <div class="button-container">
                <a href="{{ $resetUrl }}" class="reset-button">
                    🔐 Restablecer Contraseña
                </a>
            </div>

            <div class="expiry-info">
                ⏰ Este enlace expirará en 60 minutos por seguridad.
            </div>

            <div class="security-notice">
                <p><strong>¿No solicitaste este cambio?</strong></p>
                <p>Si no fuiste tú quien solicitó restablecer la contraseña, simplemente ignora este correo. Tu cuenta permanecerá segura.</p>
            </div>

            <div class="url-fallback">
                <p><strong>¿Tienes problemas con el botón?</strong></p>
                <p>Copia y pega esta URL en tu navegador:</p>
                <p>{{ $resetUrl }}</p>
            </div>

            <p style="margin-top: 30px; color: #6b7280;">
                ¡Gracias por ser parte de nuestra comunidad cafetera! ☕
            </p>
        </div>

        <div class="footer">
            <p>Este es un correo automático. Por favor, no respondas a este mensaje.</p>
            <p>© {{ date('Y') }} <span class="brand">Cafetería</span>. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
