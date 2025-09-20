import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // Determinar la ruta del dashboard según el rol del usuario
    const getDashboardRoute = () => {
        if (!auth.user) return route('login');
        
        switch (auth.user.rol) {
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

    return (
        <>
            <Head title="Bienvenido - CafeTech" />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            {/* Logo */}
                            <div className="flex items-center">
                                <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-3 mr-3">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h10M7 16h10"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        CafeTech
                                    </h1>
                                    <p className="text-sm text-gray-600">Sabor y calidad excepcional</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center space-x-8">
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700">
                                            Hola, <span className="font-semibold">{auth.user.name}</span>
                                        </span>
                                        <Link
                                            href={getDashboardRoute()}
                                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            Mi Panel
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-300"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="text-center">
                            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                    Café
                                </span>
                                <br />
                                <span className="text-gray-800">ggs</span>
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Descubre la experiencia única de nuestros cafés artesanales, 
                                preparados con los granos más selectos del mundo.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Únete a Nosotros
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mt-20">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Calidad Premium</h3>
                                <p className="text-gray-600">
                                    Granos selectos de las mejores plantaciones del mundo, 
                                    tostados artesanalmente para obtener el sabor perfecto.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Servicio Rápido</h3>
                                <p className="text-gray-600">
                                    Atención personalizada y tiempos de entrega optimizados 
                                    para que disfrutes tu café cuando lo necesites.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ambiente Acogedor</h3>
                                <p className="text-gray-600">
                                    Un espacio diseñado para relajarte, trabajar o compartir 
                                    momentos especiales con amigos y familia.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">CafeTech</h4>
                                <p className="text-gray-300">
                                    Tu lugar favorito para disfrutar del mejor café artesanal.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Enlaces</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li><a href="#" className="hover:text-amber-400 transition-colors">Menú</a></li>
                                    <li><a href="#" className="hover:text-amber-400 transition-colors">Reservas</a></li>
                                    <li><a href="#" className="hover:text-amber-400 transition-colors">Eventos</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Contacto</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>📧 info@cafeteriapremium.com</li>
                                    <li>📞 +1 (555) 123-4567</li>
                                    <li>📍 Calle Principal #123</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Síguenos</h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Facebook</a>
                                    <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Instagram</a>
                                    <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors">Twitter</a>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 CafeTech. Todos los derechos reservados.</p>
                            <p className="mt-2 text-sm">
                                Laravel v{laravelVersion} | PHP v{phpVersion}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
