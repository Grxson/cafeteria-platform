import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Determinar la ruta del dashboard según el rol del usuario
    const getDashboardRoute = () => {
        switch (user?.rol) {
            case 'superadmin':
            case 'editor':
            case 'gestor':
                return route('admin.dashboard');
            case 'cliente':
                return route('clientes.dashboard');
            default:
                return route('login');
        }
    };

    const getDashboardName = () => {
        switch (user?.rol) {
            case 'superadmin':
            case 'editor':
            case 'gestor':
                return 'Panel Admin';
            case 'cliente':
                return 'Mi Dashboard';
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <nav className="border-b border-amber-200 bg-white/90 backdrop-blur-sm shadow-lg relative z-[100]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center">
                                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-2 mr-4">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        CafeTech
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-6 sm:-my-px sm:ml-8 sm:flex">
                                <NavLink
                                    href={getDashboardRoute()}
                                    active={route().current('admin.dashboard') || route().current('clientes.dashboard')}
                                >
                                    {getDashboardName()}
                                </NavLink>
                                
                                {user?.rol === 'cliente' && (
                                    <NavLink
                                        href={route('clientes.tienda')}
                                        active={route().current('clientes.tienda')}
                                    >
                                        Tienda
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex">
                                            <button
                                                type="button"
                                                className="flex items-center space-x-3 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-amber-50/50 focus:outline-none"
                                            >
                                                {/* Avatar circular */}
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                
                                                <span className="text-gray-700 font-medium hidden lg:block">
                                                    {user.name}
                                                </span>

                                                <svg
                                                    className="h-4 w-4 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="56">
                                        {/* Header del usuario */}
                                        <div className="px-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                    <p className="text-xs text-amber-600 font-medium">@{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Navegación */}
                                        <div className="py-2">
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                                className="flex items-center space-x-3 group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Mi Perfil</span>
                                                    <p className="text-xs text-gray-500">Configurar cuenta</p>
                                                </div>
                                            </Dropdown.Link>
                                            
                                            {user.rol === 'cliente' && (
                                                <Dropdown.Link
                                                    href={route('clientes.dashboard')}
                                                    className="flex items-center space-x-3 group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Mi Dashboard</span>
                                                        <p className="text-xs text-gray-500">Panel de cliente</p>
                                                    </div>
                                                </Dropdown.Link>
                                            )}
                                            
                                            {(user.rol === 'superadmin' || user.rol === 'editor' || user.rol === 'gestor') && (
                                                <Dropdown.Link
                                                    href={route('admin.dashboard')}
                                                    className="flex items-center space-x-3 group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Panel Admin</span>
                                                        <p className="text-xs text-gray-500">Administración</p>
                                                    </div>
                                                </Dropdown.Link>
                                            )}
                                        </div>
                                        
                                        {/* Separador */}
                                        <div className="border-t border-amber-100"></div>
                                        
                                        {/* Logout */}
                                        <div className="py-2">
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors">
                                                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Cerrar Sesión</span>
                                                    <p className="text-xs text-gray-500">Salir de la cuenta</p>
                                                </div>
                                            </Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-amber-600 transition duration-150 ease-in-out hover:bg-amber-50 hover:text-amber-700 focus:bg-amber-100 focus:text-amber-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={getDashboardRoute()}
                            active={route().current('admin.dashboard') || route().current('clientes.dashboard')}
                        >
                            {getDashboardName()}
                        </ResponsiveNavLink>
                        
                        {user?.rol === 'cliente' && (
                            <ResponsiveNavLink
                                href={route('clientes.tienda')}
                                active={route().current('clientes.tienda')}
                            >
                                Tienda
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-amber-200 pb-1 pt-4">
                        <div className="px-4 mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-md">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Mi Perfil
                            </ResponsiveNavLink>
                            
                            {user.rol === 'cliente' && (
                                <ResponsiveNavLink href={route('clientes.dashboard')}>
                                    Mi Dashboard
                                </ResponsiveNavLink>
                            )}
                            
                            {(user.rol === 'superadmin' || user.rol === 'editor' || user.rol === 'gestor') && (
                                <ResponsiveNavLink href={route('admin.dashboard')}>
                                    Panel Admin
                                </ResponsiveNavLink>
                            )}
                            
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="text-red-600"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gradient-to-r from-amber-50 to-orange-50 shadow-md border-b border-amber-200 relative z-[50]">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative z-[10]">{children}</main>
        </div>
    );
}
