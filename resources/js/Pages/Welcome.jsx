import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, ShoppingCartIcon, HeartIcon, UserGroupIcon, ShoppingBagIcon, TrophyIcon, CheckCircleIcon, ClockIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getImagenUrl, getAvatarUrl } from '@/Utils/avatarUtils';

export default function Welcome({ auth, productosDestacados, productosPopulares, testimonios, estadisticas, categorias, canLogin, canRegister }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

    // Auto-play del carrusel principal
    useEffect(() => {
        if (!isAutoPlay || productosDestacados.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % productosDestacados.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlay, productosDestacados.length]);

    // Auto-play de testimonios
    useEffect(() => {
        if (testimonios.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonios.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [testimonios.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % productosDestacados.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + productosDestacados.length) % productosDestacados.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const renderizarEstrellas = (calificacion, size = 'w-5 h-5') => {
        return [1, 2, 3, 4, 5].map((star) => {
            const filled = calificacion >= star;
            const halfFilled = calificacion >= star - 0.5 && calificacion < star;
            
            return (
                <div key={star} className={`${size} relative inline-block`}>
                    <svg
                        className={`${size} text-gray-300 fill-current absolute`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    
                    <svg
                        className={`${size} text-amber-400 fill-current relative`}
                        viewBox="0 0 20 20"
                        style={{
                            clipPath: filled 
                                ? 'none' 
                                : halfFilled 
                                    ? 'inset(0 50% 0 0)' 
                                    : 'inset(0 100% 0 0)'
                        }}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            );
        });
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setNewsletterSubmitted(true);
            setNewsletterEmail('');
            setTimeout(() => setNewsletterSubmitted(false), 3000);
        }
    };

    // Función para scroll suave a una sección
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Añadir efecto de resaltado temporal
            element.classList.add('section-highlight');
            
            // Scroll suave
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            
            // Remover el efecto de resaltado después de la animación
            setTimeout(() => {
                element.classList.remove('section-highlight');
            }, 2000);
        }
    };

    // Función para manejar clics en enlaces del navbar
    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        scrollToSection(sectionId);
    };

    return (
        <>
            <Head title="CafeTech - Tu Experiencia Cafetera Premium" />
            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                }
                
                /* Animación adicional para el scroll */
                @media (prefers-reduced-motion: no-preference) {
                    html {
                        scroll-behavior: smooth;
                    }
                }
                
                /* Efecto de resaltado temporal para las secciones */
                .section-highlight {
                    animation: highlight 2s ease-in-out;
                }
                
                @keyframes highlight {
                    0% { background-color: transparent; }
                    50% { background-color: rgba(251, 191, 36, 0.1); }
                    100% { background-color: transparent; }
                }
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
                {/* Header */}
                <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo */}
                            <Link href="/" className="flex items-center group">
                                <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-3 mr-3 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        CafeTech
                                    </h1>
                                    <p className="text-sm text-gray-600">Experiencia Premium</p>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center space-x-8">
                                <div className="flex items-center space-x-6">
                                    <button 
                                        onClick={(e) => handleNavClick(e, 'productos')} 
                                        className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 cursor-pointer hover:scale-105 transform"
                                    >
                                        Productos
                                    </button>
                                    <button 
                                        onClick={(e) => handleNavClick(e, 'testimonios')} 
                                        className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 cursor-pointer hover:scale-105 transform"
                                    >
                                        Testimonios
                                    </button>
                                    <button 
                                        onClick={(e) => handleNavClick(e, 'estadisticas')} 
                                        className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 cursor-pointer hover:scale-105 transform"
                                    >
                                        Nosotros
                                    </button>
                                    <button 
                                        onClick={(e) => handleNavClick(e, 'contacto')} 
                                        className="text-gray-700 hover:text-amber-600 font-medium transition-all duration-300 cursor-pointer hover:scale-105 transform"
                                    >
                                        Contacto
                                    </button>
                                    <Link
                                        href={route('tienda.publica')}
                                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Ver Tienda
                                    </Link>
                                </div>
                                
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700">
                                            Hola, <span className="font-semibold text-amber-600">{auth.user.name}</span>
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
                    {/* Carrusel de productos destacados */}
                    {productosDestacados && productosDestacados.length > 0 ? (
                        <section id="productos" className="relative py-16 overflow-hidden">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                            Productos Destacados
                                        </span>
                                    </h2>
                                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                        Descubre nuestros cafés más populares, cuidadosamente seleccionados para brindarte la mejor experiencia.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="overflow-hidden rounded-3xl shadow-2xl">
                                        <div 
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                        >
                                            {productosDestacados.map((producto, index) => (
                                                <div key={producto.id} className="w-full flex-shrink-0">
                                                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-8 md:p-16">
                                                        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                                                            <div className="order-2 lg:order-1">
                                                                <div className="relative">
                                                                    <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white p-4">
                                                                        <img
                                                                            src={producto.imagen_principal ? getImagenUrl(producto.imagen_principal) : '/images/placeholder-coffee.jpg'}
                                                                            alt={producto.nombre}
                                                                            className="w-full h-full object-cover rounded-2xl"
                                                                        />
                                                                    </div>
                                                                    <div className="absolute top-4 left-4">
                                                                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                                                            {producto.categoria}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="order-1 lg:order-2 text-center lg:text-left">
                                                                <div className="mb-6">
                                                                    <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                                                                        {producto.nombre}
                                                                    </h3>
                                                                    <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                                                                        {producto.descripcion || 'Un café excepcional que despertará tus sentidos con cada sorbo.'}
                                                                    </p>
                                                                    <div className="flex items-center justify-center lg:justify-start mb-6">
                                                                        <div className="flex items-center space-x-1">
                                                                            {renderizarEstrellas(producto.promedio_calificacion_exacto || producto.promedio_calificacion, 'w-6 h-6')}
                                                                        </div>
                                                                        <span className="ml-2 text-gray-600 font-medium">
                                                                            {producto.total_comentarios > 0 
                                                                                ? `${producto.promedio_calificacion} (${producto.total_comentarios} ${producto.total_comentarios === 1 ? 'reseña' : 'reseñas'})`
                                                                                : 'Sin reseñas aún'
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="mb-8">
                                                                    <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                                                                        ${parseFloat(producto.precio).toFixed(2)}
                                                                    </div>
                                                                    <p className="text-gray-600">
                                                                        {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : 'Agotado'}
                                                                    </p>
                                                                </div>

                                                                {auth.user && producto.stock > 0 && (
                                                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                                                        <Link
                                                                            href={route('clientes.producto.show', producto.id)}
                                                                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                                                                        >
                                                                            <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                                                            Ver Producto
                                                                        </Link>
                                                                    </div>
                                                                )}

                                                                {!auth.user && (
                                                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                                                        <Link
                                                                            href={route('tienda.publica')}
                                                                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                                                                        >
                                                                            <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                                                            Explorar Tienda
                                                                        </Link>
                                                                        <Link
                                                                            href={route('register')}
                                                                            className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300"
                                                                        >
                                                                            Registrarse
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {productosDestacados.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevSlide}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
                                                onMouseEnter={() => setIsAutoPlay(false)}
                                                onMouseLeave={() => setIsAutoPlay(true)}
                                            >
                                                <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={nextSlide}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10"
                                                onMouseEnter={() => setIsAutoPlay(false)}
                                                onMouseLeave={() => setIsAutoPlay(true)}
                                            >
                                                <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                                            </button>

                                            <div className="flex justify-center mt-8 space-x-2">
                                                {productosDestacados.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => goToSlide(index)}
                                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                            index === currentSlide
                                                                ? 'bg-amber-600 scale-125'
                                                                : 'bg-gray-300 hover:bg-gray-400'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="relative py-16 overflow-hidden">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center">
                                    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                                            Bienvenido a CafeTech
                                        </span>
                                    </h2>
                                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                        Próximamente tendremos productos increíbles para ti. 
                                        Mientras tanto, ¡explora nuestra plataforma!
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
                            </div>
                        </section>
                    )}

                    {/* Sección de estadísticas */}
                    <section id="estadisticas" className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Números que Hablan
                                </h2>
                                <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                                    La confianza de nuestros clientes se refleja en estos números
                                </p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-8">
                                <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                        <ShoppingBagIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">{estadisticas.total_productos}</div>
                                    <div className="text-amber-100">Productos Premium</div>
                                </div>

                                <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                        <UserGroupIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">{estadisticas.total_clientes}</div>
                                    <div className="text-amber-100">Clientes Satisfechos</div>
                                </div>

                                <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                        <TrophyIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">{estadisticas.total_pedidos}</div>
                                    <div className="text-amber-100">Pedidos Completados</div>
                                </div>

                                <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                                    <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                        <StarIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {estadisticas.promedio_calificacion || '0.0'}
                                    </div>
                                    <div className="text-amber-100">Calificación Promedio</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección de productos populares */}
                    {productosPopulares && productosPopulares.length > 0 && (
                        <section className="py-20 bg-white/50 backdrop-blur-sm">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                        Los Más <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Vendidos</span>
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                        Descubre los productos favoritos de nuestros clientes
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {productosPopulares.map((producto) => (
                                        <div key={producto.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="relative mb-4">
                                                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 p-4">
                                                    <img
                                                        src={producto.imagen_principal ? getImagenUrl(producto.imagen_principal) : '/images/placeholder-coffee.jpg'}
                                                        alt={producto.nombre}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                        {producto.ventas} vendidos
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{producto.nombre}</h3>
                                                <p className="text-sm text-gray-600 mb-3">{producto.categoria}</p>
                                                <div className="text-2xl font-bold text-amber-600 mb-4">
                                                    ${parseFloat(producto.precio).toFixed(2)}
                                                </div>
                                                {auth.user ? (
                                                    <Link
                                                        href={route('clientes.producto.show', producto.id)}
                                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 inline-block"
                                                    >
                                                        Ver Producto
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={route('tienda.publica')}
                                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 inline-block"
                                                    >
                                                        Ver Tienda
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Sección de testimonios */}
                    {testimonios && testimonios.length > 0 && (
                        <section id="testimonios" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                        Lo que Dicen <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Nuestros Clientes</span>
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                        Testimonios reales de clientes satisfechos
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="overflow-hidden rounded-3xl">
                                        <div 
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                                        >
                                            {testimonios.map((testimonio, index) => (
                                                <div key={testimonio.id} className="w-full flex-shrink-0">
                                                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl">
                                                        <div className="max-w-4xl mx-auto text-center">
                                                            <div className="flex justify-center mb-6">
                                                                {renderizarEstrellas(testimonio.calificacion, 'w-8 h-8')}
                                                            </div>
                                                            <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
                                                                "{testimonio.comentario}"
                                                            </blockquote>
                                                            <div className="flex items-center justify-center space-x-4">
                                                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                                    {testimonio.usuario.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-semibold text-gray-900">{testimonio.usuario}</div>
                                                                    <div className="text-gray-600 text-sm">Sobre {testimonio.producto}</div>
                                                                    <div className="text-gray-500 text-xs">{testimonio.fecha}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {testimonios.length > 1 && (
                                        <div className="flex justify-center mt-8 space-x-2">
                                            {testimonios.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentTestimonial(index)}
                                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                        index === currentTestimonial
                                                            ? 'bg-amber-600 scale-125'
                                                            : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Sección de proceso */}
                    <section className="py-20 bg-white/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    Nuestro <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Proceso</span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Desde la selección hasta tu mesa, cada paso está diseñado para la excelencia
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                                        <CheckCircleIcon className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Selección Premium</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Granos cuidadosamente seleccionados de las mejores plantaciones del mundo, 
                                        garantizando calidad y sabor excepcionales.
                                    </p>
                                </div>

                                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                                        <ClockIcon className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Tostado Artesanal</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Proceso de tostado tradicional que resalta las características únicas 
                                        de cada grano, creando perfiles de sabor inigualables.
                                    </p>
                                </div>

                                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                                        <TruckIcon className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Entrega Garantizada</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Sistema de entrega rápido y confiable que asegura que tu café 
                                        llegue fresco y en perfectas condiciones.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección de newsletter */}
                    <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
                        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Mantente Actualizado
                            </h2>
                            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                                Recibe ofertas exclusivas, nuevos productos y consejos para amantes del café.
                            </p>
                            
                            {newsletterSubmitted ? (
                                <div className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold inline-block">
                                    ¡Gracias por suscribirte! 🎉
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Tu email"
                                        className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Suscribirse
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>

                    {/* Call to Action final */}
                    {!auth.user && (
                        <section className="py-20 bg-gradient-to-br from-gray-900 to-amber-900">
                            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    ¿Listo para tu Aventura Cafetera?
                                </h2>
                                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                    Únete a nuestra comunidad y descubre un mundo de sabores excepcionales.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('tienda.publica')}
                                        className="bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                                    >
                                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                        Explorar Tienda
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Crear Cuenta Gratis
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-amber-600 transition-all duration-300"
                                    >
                                        Ya tengo cuenta
                                    </Link>
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                {/* Footer */}
                <footer id="contacto" className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">CafeTech</h4>
                                <p className="text-gray-300 leading-relaxed">
                                    Tu lugar favorito para disfrutar del mejor café artesanal. 
                                    Calidad, sabor y experiencia en cada taza.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Productos</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li><button onClick={(e) => handleNavClick(e, 'productos')} className="hover:text-amber-400 transition-colors cursor-pointer">Cafés Especiales</button></li>
                                    <li><button onClick={(e) => handleNavClick(e, 'productos')} className="hover:text-amber-400 transition-colors cursor-pointer">Granos Premium</button></li>
                                    <li><button onClick={(e) => handleNavClick(e, 'productos')} className="hover:text-amber-400 transition-colors cursor-pointer">Accesorios</button></li>
                                    <li><button onClick={(e) => handleNavClick(e, 'productos')} className="hover:text-amber-400 transition-colors cursor-pointer">Regalos</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Servicios</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li><button onClick={(e) => handleNavClick(e, 'estadisticas')} className="hover:text-amber-400 transition-colors cursor-pointer">Sobre Nosotros</button></li>
                                    <li><button onClick={(e) => handleNavClick(e, 'contacto')} className="hover:text-amber-400 transition-colors cursor-pointer">Contacto</button></li>
                                    <li><button onClick={(e) => handleNavClick(e, 'testimonios')} className="hover:text-amber-400 transition-colors cursor-pointer">Testimonios</button></li>
                                    <li><a href="#" className="hover:text-amber-400 transition-colors">Soporte</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-amber-400">Contacto</h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        info@cafetech.com
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        +1 (555) 123-4567
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        Calle Principal #123, Ciudad
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 CafeTech. Todos los derechos reservados.</p>
                            <p className="mt-2 text-sm">
                                Desarrollado con ❤️ para amantes del café
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}