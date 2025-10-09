import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Mi Perfil - CafeTech" />

            <div className="min-h-screen bg-gray-50 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                        <p className="text-gray-600">Administra tu información personal y configuración de cuenta</p>
                    </div>

                    {/* Main Content Grid - Collage Style */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Picture & Basic Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Picture Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="bg-gray-100 rounded-lg p-2 mr-3">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                    </div>
                                    Foto de Perfil
                                </h3>
                                <div className="text-center">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-full"
                                        showOnlyAvatar={true}
                                    />
                                </div>
                            </div>

                            {/* Recomendaciones Personalizadas */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="bg-amber-100 rounded-lg p-2 mr-3">
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                    Recomendaciones para Ti
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Cappuccino Premium</p>
                                                <p className="text-sm text-gray-600">Basado en tu gusto por café fuerte</p>
                                                <p className="text-xs text-amber-600 font-medium">$4.50</p>
                                            </div>
                                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                                                Ver
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">Croissant de Almendras</p>
                                                <p className="text-sm text-gray-600">Perfecto para acompañar tu café</p>
                                                <p className="text-xs text-amber-600 font-medium">$3.20</p>
                                            </div>
                                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                                                Ver
                                            </button>
                                        </div>
                                    </div>

                                    <button className="w-full text-center py-2 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
                                        Ver todas las recomendaciones →
                                    </button>
                                </div>
                            </div>

                            {/* Accesos Rápidos */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <div className="bg-gray-100 rounded-lg p-2 mr-3">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    Accesos Rápidos
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 rounded-lg p-2 mr-3">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Reordenar Favorito</p>
                                                <p className="text-sm text-gray-500">Americano + Croissant</p>
                                            </div>
                                        </div>
                                    </button>
                                    
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            <div className="bg-green-100 rounded-lg p-2 mr-3">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M12.5 17a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Mi Carrito</p>
                                                <p className="text-sm text-gray-500">3 productos</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            <div className="bg-purple-100 rounded-lg p-2 mr-3">
                                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Cafés Calientes</p>
                                                <p className="text-sm text-gray-500">Tu categoría favorita</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center">
                                            <div className="bg-orange-100 rounded-lg p-2 mr-3">
                                                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Pedidos Recientes</p>
                                                <p className="text-sm text-gray-500">Ver historial completo</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Right Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information Form */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <div className="bg-gray-100 rounded-lg p-2 mr-3">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        Información Personal
                                    </h3>
                                    <p className="text-gray-600 text-sm ml-11">Actualiza tu información personal</p>
                                </div>
                                <div className="p-6">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-full"
                                        showOnlyForm={true}
                                    />
                                </div>
                            </div>

                            {/* Security & Danger Zone - Side by Side */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {/* Security */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <div className="bg-gray-100 rounded-lg p-2 mr-3">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                            </div>
                                            Seguridad
                                        </h3>
                                        <p className="text-gray-600 text-sm ml-11">Cambiar contraseña</p>
                                    </div>
                                    <div className="p-6">
                                        <UpdatePasswordForm className="max-w-full" />
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                                    <div className="border-b border-red-200 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-red-900 flex items-center">
                                            <div className="bg-red-100 rounded-lg p-2 mr-3">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                                </svg>
                                            </div>
                                            Zona Peligrosa
                                        </h3>
                                        <p className="text-red-700 text-sm ml-11">Eliminar cuenta</p>
                                    </div>
                                    <div className="p-6">
                                        <DeleteUserForm className="max-w-full" />
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
