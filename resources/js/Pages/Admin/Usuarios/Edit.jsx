import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    LockClosedIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function UsuarioEdit({ usuario }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: usuario.name || '',
        email: usuario.email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.usuarios.update', usuario.id), {
            onSuccess: () => {
                // El controlador manejará la redirección
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.usuarios.show', usuario.id)}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                            Editar Usuario
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Editar ${usuario.name} - Admin`} />

            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Información del Usuario</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Actualiza la información personal del usuario
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    <UserIcon className="w-4 h-4 inline mr-1" />
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Ingresa el nombre completo"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <XMarkIcon className="w-4 h-4 mr-1" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="usuario@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <XMarkIcon className="w-4 h-4 mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    <LockClosedIcon className="w-4 h-4 inline mr-1" />
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Deja vacío para mantener la contraseña actual"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <CheckIcon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <XMarkIcon className="w-4 h-4 mr-1" />
                                        {errors.password}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Mínimo 8 caracteres. Deja vacío si no quieres cambiar la contraseña.
                                </p>
                            </div>

                            {/* Confirmar Contraseña */}
                            {data.password && (
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                        <LockClosedIcon className="w-4 h-4 inline mr-1" />
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                                errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Confirma la nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? (
                                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <CheckIcon className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <XMarkIcon className="w-4 h-4 mr-1" />
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Información adicional */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Usuario</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">ID:</span> #{usuario.id}
                                    </div>
                                    <div>
                                        <span className="font-medium">Rol:</span> {usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : 'Cliente'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Registrado:</span> {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                                    </div>
                                    <div>
                                        <span className="font-medium">Estado:</span> 
                                        <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                            usuario.email_verified_at 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {usuario.email_verified_at ? 'Verificado' : 'No Verificado'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('admin.usuarios.show', usuario.id)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
