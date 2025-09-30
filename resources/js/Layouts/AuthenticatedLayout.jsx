import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getAvatarUrl } from '@/Utils/avatarUtils';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [carritoCount, setCarritoCount] = useState(0);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Cargar contador del carrito al inicializar
    useEffect(() => {
        if (user?.rol === 'cliente') {
            cargarContadorCarrito();

            // Escuchar eventos de actualización del carrito
            const manejarActualizacionCarrito = (event) => {
                setCarritoCount(event.detail || 0);
            };

            window.addEventListener('carritoActualizado', manejarActualizacionCarrito);

            return () => {
                window.removeEventListener('carritoActualizado', manejarActualizacionCarrito);
            };
        }
    }, [user]);

    const cargarContadorCarrito = async () => {
        try {
            const response = await fetch(route('clientes.carrito.count'));
            if (response.ok) {
                const data = await response.json();
                setCarritoCount(data.count || 0);
            }
        } catch (error) {
            console.error('Error al cargar contador del carrito:', error);
        }
    };

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
            <nav className="fixed top-0 left-0 right-0 border-b border-amber-200 bg-white/95 backdrop-blur-md shadow-lg z-[100]">
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

                                {user?.rol === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('admin.productos.index')}
                                            active={route().current('admin.productos.*')}
                                        >
                                            Productos
                                        </NavLink>
                                        <NavLink
                                            href={route('reportes.index')}
                                            active={route().current('reportes.*')}
                                        >
                                            Reportes
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                            {/* Icono del carrito - solo para clientes */}
                            {user?.rol === 'cliente' && (
                                <Link
                                    href={route('clientes.carrito')}
                                    className="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group"
                                >
                                    <ShoppingCartIcon className="w-6 h-6" />

                                    {/* Contador del carrito */}
                                    {carritoCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                            {carritoCount > 99 ? '99+' : carritoCount}
                                        </span>
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Mi Carrito {carritoCount > 0 && `(${carritoCount})`}
                                    </div>
                                </Link>
                            )}

                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex">
                                            <button
                                                type="button"
                                                className="flex items-center space-x-3 px-3 py-2 text-sm transition duration-150 ease-in-out hover:bg-amber-50/50 focus:outline-none"
                                            >
                                                {/* Avatar circular */}
                                                {user.avatar_url ? (
                                                    <img
                                                        src={getAvatarUrl(user.avatar_url)}
                                                        alt="Avatar"
                                                        className="h-8 w-8 rounded-full object-cover shadow-md"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}

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
                                                {user.avatar_url ? (
                                                    <img
                                                        src={getAvatarUrl(user.avatar_url)}
                                                        alt="Avatar"
                                                        className="h-10 w-10 rounded-full object-cover shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
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

                        <div className="-me-2 flex items-center space-x-3 sm:hidden">
                            {/* Icono del carrito - solo para clientes en móvil */}
                            {user?.rol === 'cliente' && (
                                <Link
                                    href={route('clientes.carrito')}
                                    className="relative p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                >
                                    <ShoppingCartIcon className="w-6 h-6" />

                                    {/* Contador del carrito */}
                                    {carritoCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                                            {carritoCount > 99 ? '99+' : carritoCount}
                                        </span>
                                    )}
                                </Link>
                            )}

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

                {/* Overlay para sidebar móvil */}
                {showingNavigationDropdown && (
                    <div
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden"
                        onClick={() => setShowingNavigationDropdown(false)}
                    />
                )}

                {/* Sidebar móvil */}
                <div
                    className={`
                        fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out sm:hidden
                        ${showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Header del sidebar */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {user.avatar_url ? (
                                    <img
                                        src={getAvatarUrl(user.avatar_url)}
                                        alt="Avatar"
                                        className="h-14 w-14 rounded-full object-cover shadow-lg border-2 border-white border-opacity-30"
                                    />
                                ) : (
                                    <div className="h-14 w-14 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white border-opacity-30">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="text-xl font-semibold text-white">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-orange-100 opacity-90">
                                        {user.email}
                                    </div>
                                    <div className="text-xs text-orange-200 opacity-75 mt-1 capitalize">
                                        {user.rol === 'cliente' ? 'Cliente' : 'Administrador'}
                                    </div>
                                </div>
                            </div>

                            {/* Botón cerrar sidebar */}
                            <button
                                onClick={() => setShowingNavigationDropdown(false)}
                                className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navegación del sidebar */}
                    <div className="flex-1 overflow-y-auto bg-white">
                        {/* Dashboard */}
                        <ResponsiveNavLink
                            href={getDashboardRoute()}
                            active={route().current('admin.dashboard') || route().current('clientes.dashboard')}
                            className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            <div className="p-2 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors mr-4">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"></path>
                                </svg>
                            </div>
                            <div>
                                <span className="text-gray-800 font-semibold">{getDashboardName()}</span>
                                <p className="text-xs text-gray-500 mt-0.5">Panel principal</p>
                            </div>
                        </ResponsiveNavLink>

                        {/* Tienda - solo para clientes */}
                        {user?.rol === 'cliente' && (
                            <ResponsiveNavLink
                                href={route('clientes.tienda')}
                                active={route().current('clientes.tienda')}
                                className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors mr-4">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-gray-800 font-semibold">Tienda</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Explorar productos</p>
                                </div>
                            </ResponsiveNavLink>
                        )}

                        {/* Menú de administrador */}
                        {user?.rol === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.productos.index')}
                                    active={route().current('admin.productos.*')}
                                    className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors mr-4">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-gray-800 font-semibold">Productos</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Gestión de inventario</p>
                                    </div>
                                </ResponsiveNavLink>

                                <ResponsiveNavLink
                                    href={route('reportes.index')}
                                    active={route().current('reportes.*')}
                                    className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                                    onClick={() => setShowingNavigationDropdown(false)}
                                >
                                    <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors mr-4">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-gray-800 font-semibold">Reportes</span>
                                        <p className="text-xs text-gray-500 mt-0.5">Análisis y DataTable</p>
                                    </div>
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Mi Perfil */}
                        <ResponsiveNavLink
                            href={route('profile.edit')}
                            className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors mr-4">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div>
                                <span className="text-gray-800 font-semibold">Mi Perfil</span>
                                <p className="text-xs text-gray-500 mt-0.5">Configuración de cuenta</p>
                            </div>
                        </ResponsiveNavLink>

                        {/* Panel Admin - solo para administradores */}
                        {(user.rol === 'superadmin' || user.rol === 'editor' || user.rol === 'gestor') && (
                            <ResponsiveNavLink
                                href={route('admin.dashboard')}
                                className="flex items-center px-6 py-4 border-b border-amber-100 hover:bg-amber-50 transition-all duration-200 group"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors mr-4">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-gray-800 font-semibold">Panel Admin</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Administración</p>
                                </div>
                            </ResponsiveNavLink>
                        )}

                        {/* Cerrar Sesión */}
                        <ResponsiveNavLink
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="flex items-center px-6 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
                            onClick={() => setShowingNavigationDropdown(false)}
                        >
                            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors mr-4">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </div>
                            <div>
                                <span className="font-semibold">Cerrar Sesión</span>
                                <p className="text-xs text-red-400 mt-0.5">Salir de la cuenta</p>
                            </div>
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gradient-to-r from-amber-50 to-orange-50 shadow-md border-b border-amber-200 relative z-[50] pt-16">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className={`relative z-[10] ${!header ? 'pt-16' : ''}`}>{children}</main>
        </div>
    );
}
