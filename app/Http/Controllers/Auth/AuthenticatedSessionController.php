<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Redirección basada en roles
        $user = Auth::user();

        switch ($user->rol) {
            case 'superadmin':
            case 'editor':
            case 'gestor':
                return redirect()->intended(route('admin.dashboard'));
            case 'cliente':
                return redirect()->intended(route('clientes.tienda'));
            default:
                // Si no tiene rol definido, redirigir al login
                return redirect()->route('login')->with('error', 'Rol de usuario no válido.');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Log::info('Logout iniciado para usuario: ' . Auth::id());

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // Limpiar cookies adicionales si existen
        $response = redirect('/');
        $response->withCookie(cookie()->forget('laravel_session'));
        $response->withCookie(cookie()->forget('XSRF-TOKEN'));

        Log::info('Logout completado');

        return $response->with('success', 'Sesión cerrada exitosamente.');
    }
}
