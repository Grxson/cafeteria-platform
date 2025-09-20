import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ClienteDashboard({ cliente }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-amber-800">
                    Mi Panel de Cliente
                </h2>
            }
        >
            <Head title="Dashboard Cliente - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Card - Compacto */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-xl border border-amber-200 mb-6">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">¡Hola, {cliente?.name}!</h3>
                                    <p className="text-amber-50 text-sm">Bienvenido a CafeTech</p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="bg-white/20 rounded-full p-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* My Orders */}
                                <div className="bg-white p-5 rounded-xl border border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-800">Mis Pedidos</h4>
                                            <p className="text-gray-600">Historial de compras</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <a href="/cliente/pedidos" className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md">
                                            Ver pedidos
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Tienda */}
                                <div className="bg-white p-5 rounded-xl border border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-3 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-800">Tienda</h4>
                                            <p className="text-gray-600">Explora nuestros productos</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <a href="/cliente/tienda" className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all font-medium shadow-md">
                                            Ver tienda
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Profile */}
                                <div className="bg-white p-5 rounded-xl border border-amber-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    <div className="flex items-center mb-3">
                                        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-3 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-xl font-bold text-gray-800">Mi Perfil</h4>
                                            <p className="text-gray-600">Datos personales</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <a href="/profile" className="inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all font-medium shadow-md border border-yellow-400">
                                            Editar perfil
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones Rápidas */}
                            <div className="mt-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">Acciones Rápidas</h3>
                                    <p className="text-gray-600">Accede rápidamente a las funciones más utilizadas</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border-2 border-amber-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-amber-400">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center mb-3">
                                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2 mr-3">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-gray-800">Hacer Pedido</h4>
                                                </div>
                                                <p className="text-gray-600 mb-4">Ordena tu café favorito ahora mismo</p>
                                            </div>
                                            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                                <span className="text-lg">🛒</span>
                                                <span className="ml-2">Hacer Pedido</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl border-2 border-yellow-300 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-yellow-400">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center mb-3">
                                                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-2 mr-3">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                                        </svg>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-gray-800">Ver Menú</h4>
                                                </div>
                                                <p className="text-gray-600 mb-4">Explora toda nuestra carta de productos</p>
                                            </div>
                                            <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                                <span className="text-lg">🍵</span>
                                                <span className="ml-2">Ver Menú</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actividad Reciente */}
                    <div className="bg-white shadow-xl sm:rounded-2xl border border-amber-200">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white">Actividad Reciente</h3>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="bg-green-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Bienvenido a CafeTech</h4>
                                    <p className="text-gray-600 mb-6">Tu cuenta ha sido creada exitosamente</p>
                                    <p className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
                                        ¡Gracias por unirte a nuestra comunidad! Explora nuestro menú y disfruta de una experiencia cafetera única.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}