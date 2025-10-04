<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Add Inertia middleware to web group
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Configurar redirecciones de autenticación para Inertia
        $middleware->redirectUsersTo(function ($request) {
            return route('dashboard');
        });

        $middleware->redirectGuestsTo(function ($request) {
            return route('login');
        });

        // Registrar middlewares personalizados
        $middleware->alias([
            'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'client' => \App\Http\Middleware\EnsureUserIsClient::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Manejo específico para errores de autenticación (401)
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            // Para solicitudes Inertia, hacer un hard redirect al login
            if ($request->header('X-Inertia')) {
                return response('', 409, ['X-Inertia-Location' => route('login')]);
            }
            
            return redirect()->guest(route('login'));
        });

        // Manejo específico para errores HTTP (401, 403, etc.)
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            if ($e->getStatusCode() === 401) {
                // Si es una solicitud Inertia, hacer hard redirect
                if ($request->header('X-Inertia')) {
                    return response('', 409, ['X-Inertia-Location' => route('login')]);
                }
                
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'No autorizado.',
                        'redirect' => route('login')
                    ], 401);
                }

                return redirect()->route('login');
            }
        });

        // Manejo específico para errores 419 (CSRF Token Mismatch) - excepto logout
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, $request) {
            if ($e->getStatusCode() === 419 && !$request->is('logout')) {
                // Si es una solicitud Inertia, hacer hard redirect
                if ($request->header('X-Inertia')) {
                    return response('', 409, ['X-Inertia-Location' => route('login')]);
                }
                
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Token CSRF expirado. Por favor, recarga la página e intenta de nuevo.',
                        'redirect' => route('login')
                    ], 419);
                }

                return redirect()->route('login')
                    ->with('error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
        });
    })->create();
