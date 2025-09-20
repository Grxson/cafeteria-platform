import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-amber-800">
                    Mi Perfil
                </h2>
            }
        >
            <Head title="Mi Perfil - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-8 sm:px-6 lg:px-8">
                    {/* Información del Perfil */}
                    <div className="bg-white shadow-xl sm:rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Información Personal
                            </h3>
                            <p className="text-amber-50 text-sm">Actualiza tu información personal y foto de perfil</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-full"
                            />
                        </div>
                    </div>

                    {/* Cambiar Contraseña */}
                    <div className="bg-white shadow-xl sm:rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                                Seguridad
                            </h3>
                            <p className="text-blue-50 text-sm">Actualiza tu contraseña para mantener tu cuenta segura</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                            <UpdatePasswordForm className="max-w-full" />
                        </div>
                    </div>

                    {/* Eliminar Cuenta */}
                    <div className="bg-white shadow-xl sm:rounded-2xl border border-red-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                                Zona Peligrosa
                            </h3>
                            <p className="text-red-50 text-sm">Eliminar tu cuenta es una acción permanente e irreversible</p>
                        </div>
                        <div className="p-8 bg-gradient-to-br from-red-50 to-pink-50">
                            <DeleteUserForm className="max-w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
