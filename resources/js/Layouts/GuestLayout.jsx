import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-orange-100/20"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl"></div>
            
            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and Header */}
                <div className="text-center">
                    <Link href="/" className="inline-block">
                        <div className="flex items-center justify-center">
                            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-4 shadow-lg">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                        </div>
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                        CafeTech
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">Bienvenido de vuelta</p>
                </div>

                {/* Form Container */}
                <div className="mt-8 bg-white/90 backdrop-blur-sm py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-amber-100">
                    <div className="relative">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        © 2024 CafeTech. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
