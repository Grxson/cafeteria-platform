import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-amber-800">
                    Dashboard Principal
                </h2>
            }
        >
            <Head title="Dashboard - CafeTech" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Card */}
                    <div className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-xl sm:rounded-2xl border border-amber-200 mb-8">
                        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white">¡Bienvenido a CafeTech!</h3>
                            <p className="text-amber-100">Tu lugar favorito para el mejor café artesanal</p>
                        </div>
                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Quick Stats */}
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                                    <div className="flex items-center">
                                        <div className="bg-amber-500 rounded-full p-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Cafés Premium</h4>
                                            <p className="text-gray-600">Los mejores granos del mundo</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                                    <div className="flex items-center">
                                        <div className="bg-orange-500 rounded-full p-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Servicio Rápido</h4>
                                            <p className="text-gray-600">Entrega en tiempo récord</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                                    <div className="flex items-center">
                                        <div className="bg-yellow-500 rounded-full p-3">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900">Ambiente Único</h4>
                                            <p className="text-gray-600">Experiencia excepcional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600 mb-4">
                                    ¡Has iniciado sesión exitosamente! Explora todas las funciones disponibles en tu panel de control.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a href="#" className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        Ver Menú
                                    </a>
                                    <a href="#" className="border-2 border-amber-600 text-amber-600 px-6 py-2 rounded-full hover:bg-amber-600 hover:text-white transition-all duration-300">
                                        Hacer Pedido
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
