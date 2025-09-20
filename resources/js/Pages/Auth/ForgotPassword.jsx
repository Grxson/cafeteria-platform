import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Recuperar Contraseña - CafeTech" />

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute top-2/3 right-10 w-32 h-32 bg-orange-300 rounded-full opacity-25 animate-pulse delay-75"></div>
                <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-amber-300 rounded-full opacity-15 animate-pulse delay-150"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        CafeTech
                    </h1>
                    <p className="mt-2 text-sm text-amber-700">Recupera tu acceso al café premium</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-amber-200">
                    <div className="px-8 py-10">
                        <div className="text-center mb-8">
                            <div className="mb-4">
                                <div className="mx-auto h-12 w-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h2>
                            <p className="text-gray-600">
                                No te preocupes. Ingresa tu correo y te enviaremos un enlace para que puedas volver a disfrutar de nuestro café.
                            </p>
                        </div>

                        {status && (
                            <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 mb-6">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="ml-3 text-sm font-medium text-green-800">{status}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-medium" />
                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="block w-full pl-10 pr-3 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/70"
                                        placeholder="tu@email.com"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                                <p className="mt-2 text-xs text-gray-500">Te enviaremos las instrucciones a este correo</p>
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-amber-700">
                                            <strong>¿Sabías que?</strong> Tu cuenta guarda tus cafés favoritos y preferencias. 
                                            ¡No queremos que pierdas esa información!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <PrimaryButton 
                                    className="w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando enlace...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            Enviar Enlace de Recuperación
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>

                            <div className="text-center pt-4 border-t border-amber-200">
                                <p className="text-sm text-gray-600">
                                    ¿Recordaste tu contraseña?{' '}
                                    <Link
                                        href={route('login')}
                                        className="font-medium text-amber-600 hover:text-amber-800 transition-colors"
                                    >
                                        Inicia sesión aquí
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-amber-700/80">
                        ☕ "Cada problema tiene una solución, como cada café tiene su momento perfecto" ☕
                    </p>
                </div>
            </div>
        </div>
    );
}
