import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    UserGroupIcon,
    CubeIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                    Panel de Administración
                </h2>
            }
        >
            <Head title="Admin Dashboard - CafeTech" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Admin Welcome Card */}
                    <div className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl sm:rounded-2xl border border-amber-200 mb-6 sm:mb-8">
                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 sm:px-6 sm:py-4">
                            <h3 className="text-base sm:text-lg font-semibold text-white">Panel de Control - Administrador</h3>
                            <p className="text-amber-100 text-sm sm:text-base">Gestiona todos los aspectos de la cafetería</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {/* Products Management */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="bg-blue-500 rounded-full p-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Productos</h4>
                                            <p className="text-gray-600 text-sm">Gestionar inventario</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link href={route('admin.productos.index')} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Ver productos →
                                        </Link>
                                    </div>
                                </div>

                                {/* Users Management */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="bg-green-500 rounded-full p-3">
                                            <UserGroupIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Usuarios</h4>
                                            <p className="text-gray-600 text-sm">Gestionar clientes</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a href="/admin/usuarios" className="text-green-600 hover:text-green-800 text-sm font-medium">
                                            Ver usuarios →
                                        </a>
                                    </div>
                                </div>

                                {/* Orders Management */}
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="bg-purple-500 rounded-full p-3">
                                            <ShoppingBagIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Pedidos</h4>
                                            <p className="text-gray-600 text-sm">Gestionar ordenes</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a href="/admin/pedidos" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                            Ver pedidos →
                                        </a>
                                    </div>
                                </div>

                                {/* Reports */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="bg-amber-500 rounded-full p-3">
                                            <CurrencyDollarIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Reportes</h4>
                                            <p className="text-gray-600 text-sm">Estadísticas y análisis</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a href="/admin/reportes" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                                            Ver reportes →
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h4>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="/admin/productos/create"
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Agregar Producto
                                    </a>
                                    <a
                                        href="/admin/usuarios"
                                        className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        Ver Usuarios
                                    </a>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-amber-600">25</div>
                                        <div className="text-sm text-gray-600">Productos</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">120</div>
                                        <div className="text-sm text-gray-600">Clientes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">45</div>
                                        <div className="text-sm text-gray-600">Pedidos Hoy</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">$2,450</div>
                                        <div className="text-sm text-gray-600">Ventas Hoy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
