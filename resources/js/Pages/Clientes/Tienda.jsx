import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    LightBulbIcon,
    EyeIcon,
    ArchiveBoxIcon
} from '@heroicons/react/24/outline';

export default function ClienteTienda({ cliente, productos, categorias }) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [agregandoCarrito, setAgregandoCarrito] = useState({});
    const [notificacion, setNotificacion] = useState(null);

    // Función auxiliar para manejar rutas de imágenes
    const getImagenUrl = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith('http')) return imagen;
        return `/storage/${imagen}`;
    };

    // Función para obtener imagen de hover (diferente a la principal)
    const getImagenHover = (producto) => {
        if (!producto.galeria_imagenes || producto.galeria_imagenes.length === 0) {
            return null;
        }
        
        // Buscar una imagen diferente a la principal
        const imagenPrincipalUrl = getImagenUrl(producto.imagen_principal);
        for (let imagen of producto.galeria_imagenes) {
            const imagenGaleriaUrl = getImagenUrl(imagen);
            if (imagenGaleriaUrl !== imagenPrincipalUrl) {
                return imagenGaleriaUrl;
            }
        }
        
        // Si todas son iguales, usar la primera
        return getImagenUrl(producto.galeria_imagenes[0]);
    };

    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = !categoriaSeleccionada || producto.categoria_producto_id === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
    });

    const agregarAlCarrito = async (e, productoId) => {
        e.preventDefault();
        e.stopPropagation();

        setAgregandoCarrito(prev => ({ ...prev, [productoId]: true }));

        try {
            const response = await fetch(route('clientes.carrito.agregar'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    producto_id: productoId,
                    cantidad: 1
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar mensaje de éxito
                const evento = new CustomEvent('carritoActualizado', { detail: data.carrito_count });
                window.dispatchEvent(evento);

                // Mostrar notificación animada
                const producto = productos.find(p => p.id === productoId);
                setNotificacion({
                    mensaje: `¡${producto?.nombre} agregado al carrito!`,
                    tipo: 'exito'
                });

                // Ocultar notificación después de 3 segundos
                setTimeout(() => setNotificacion(null), 3000);
            } else {
                setNotificacion({
                    mensaje: data.message || 'Error al agregar el producto al carrito',
                    tipo: 'error'
                });
                setTimeout(() => setNotificacion(null), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotificacion({
                mensaje: 'Error al conectar con el servidor',
                tipo: 'error'
            });
            setTimeout(() => setNotificacion(null), 3000);
        } finally {
            setAgregandoCarrito(prev => ({ ...prev, [productoId]: false }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-amber-800">
                    Tienda - CafeTech
                </h2>
            }
        >
            <Head title="Tienda - CafeTech" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Filtros y Búsqueda */}
                    <div className="p-4 mb-6 bg-white border shadow-lg rounded-2xl border-amber-200 sm:p-6 sm:mb-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                            {/* Búsqueda */}
                            <div className="flex-1">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Buscar productos
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o descripción..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        className="w-full py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-base"
                                    />
                                </div>
                            </div>

                            {/* Filtro por categoría */}
                            <div className="w-full lg:w-1/3">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Categoría
                                </label>
                                <select
                                    value={categoriaSeleccionada || ''}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-base"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Grid de Productos */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-4 md:gap-6">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                className="w-full group cursor-pointer"
                            >
                                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-amber-300 h-[380px] sm:h-[420px] md:h-[450px] lg:h-[480px] xl:h-[500px] flex flex-col">
                                    {/* Contenedor de imagen con hover effect */}
                                    <div className="relative overflow-hidden h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 bg-gradient-to-br from-amber-50 to-orange-50">
                                        {/* Imagen principal */}
                                        {producto.imagen_principal ? (
                                            <>
                                                <img
                                                    src={getImagenUrl(producto.imagen_principal)}
                                                    alt={producto.nombre}
                                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 z-10 group-hover:opacity-0"
                                                />
                                                {/* Segunda imagen para hover effect */}
                                                {getImagenHover(producto) && getImagenHover(producto) !== getImagenUrl(producto.imagen_principal) && (
                                                    <img
                                                        src={getImagenHover(producto)}
                                                        alt={`${producto.nombre} - vista alternativa`}
                                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 z-5 opacity-0 group-hover:opacity-100"
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="text-center">
                                                    <LightBulbIcon className="w-16 h-16 mx-auto mb-2 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
                                                    <p className="text-sm font-medium text-amber-600">Producto</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Icono de "ver" siempre visible */}
                                        <Link
                                            href={route('clientes.producto.show', producto.id)}
                                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                                        >
                                            <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                                        </Link>

                                        {/* Badge de categoría */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white backdrop-blur-sm">
                                                {producto.categoria_producto?.nombre}
                                            </span>
                                        </div>

                                        {/* Indicador de stock bajo */}
                                        {producto.stock <= 5 && producto.stock > 0 && (
                                            <div className="absolute bottom-3 left-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white backdrop-blur-sm">
                                                    Solo {producto.stock} disponibles
                                                </span>
                                            </div>
                                        )}

                                        {/* Sin stock */}
                                        {producto.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                                                    Agotado
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información del producto */}
                                    <div className="flex flex-col flex-grow p-4 lg:p-5">
                                        {/* Título del producto */}
                                        <div className="mb-3">
                                            <Link
                                                href={route('clientes.producto.show', producto.id)}
                                                className="block text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight hover:text-amber-600 transition-colors duration-300"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {producto.nombre}
                                            </Link>
                                        </div>

                                        {/* Descripción */}
                                        {producto.descripcion && (
                                            <div className="mb-4 flex-grow">
                                                <p className="text-sm text-gray-600 leading-relaxed"
                                                   style={{
                                                       display: '-webkit-box',
                                                       WebkitLineClamp: 3,
                                                       WebkitBoxOrient: 'vertical',
                                                       overflow: 'hidden'
                                                   }}>
                                                    {producto.descripcion}
                                                </p>
                                            </div>
                                        )}

                                        {/* Precio y botón */}
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-2xl sm:text-3xl font-bold text-amber-600">
                                                    ${parseFloat(producto.precio).toFixed(2)}
                                                </div>
                                                {producto.stock > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        Stock: {producto.stock}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botón de agregar al carrito */}
                                            <button
                                                onClick={(e) => agregarAlCarrito(e, producto.id)}
                                                disabled={agregandoCarrito[producto.id] || producto.stock === 0}
                                                className="w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                            >
                                                {agregandoCarrito[producto.id] ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Agregando...</span>
                                                    </div>
                                                ) : producto.stock === 0 ? (
                                                    'Agotado'
                                                ) : (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                        </svg>
                                                        <span>Agregar al Carrito</span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mensaje cuando no hay productos */}
                    {productosFiltrados.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="flex items-center justify-center w-24 h-24 p-6 mx-auto mb-4 bg-gray-100 rounded-full">
                                <ArchiveBoxIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-700">No se encontraron productos</h3>
                            <p className="text-gray-500">
                                {busqueda || categoriaSeleccionada
                                    ? 'Intenta cambiar los filtros de búsqueda'
                                    : 'Aún no hay productos disponibles en la tienda'
                                }
                            </p>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="p-8 mt-12 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                        <div className="text-center">
                            <h3 className="mb-4 text-2xl font-bold">¿Necesitas ayuda?</h3>
                            <p className="mb-6 text-amber-100">
                                Nuestro equipo está aquí para ayudarte a encontrar el café perfecto para ti.
                            </p>
                            <div className="flex flex-col justify-center gap-4 md:flex-row">
                                <button className="px-6 py-3 font-semibold transition-colors bg-white rounded-lg text-amber-600 hover:bg-amber-50">
                                    Contactar Soporte
                                </button>
                                <button className="px-6 py-3 font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-amber-600">
                                    Ver Mi Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notificación animada */}
            {notificacion && (
                <div className={`fixed top-20 right-4 z-[150] px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 ${notificacion.tipo === 'exito'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    } animate-bounce`}>
                    <div className="flex items-center space-x-2">
                        {notificacion.tipo === 'exito' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        )}
                        <span className="font-medium">{notificacion.mensaje}</span>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
