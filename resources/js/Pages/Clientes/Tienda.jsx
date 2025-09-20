import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ClienteTienda({ cliente, productos, categorias }) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = !categoriaSeleccionada || producto.categoria_producto_id === categoriaSeleccionada;
        return coincideBusqueda && coincideCategoria;
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-amber-800">
                    Tienda - CafeTech
                </h2>
            }
        >
            <Head title="Tienda - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filtros y Búsqueda */}
                    <div className="bg-white shadow-lg rounded-2xl border border-amber-200 mb-8 p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Búsqueda */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar productos
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        placeholder="Buscar por nombre o descripción..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Filtro por categoría */}
                            <div className="md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={categoriaSeleccionada || ''}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value ? parseInt(e.target.value) : null)}
                                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productosFiltrados.map((producto) => (
                            <Link
                                key={producto.id}
                                href={route('clientes.producto.show', producto.id)}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                                    {/* Imagen del producto */}
                                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
                                        {producto.imagen_url ? (
                                            <img 
                                                src={producto.imagen_url} 
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <svg className="w-16 h-16 text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                                </svg>
                                                <p className="text-amber-600 font-medium">{producto.categoria_producto?.nombre || 'Producto'}</p>
                                            </div>
                                        )}
                                        
                                        {/* Overlay de hover */}
                                        <div className="absolute inset-0 bg-amber-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                                            <div className="bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información del producto */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">{producto.nombre}</h3>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                                {producto.categoria_producto?.nombre}
                                            </span>
                                        </div>
                                        
                                        {producto.descripcion && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {producto.descripcion}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-2xl font-bold text-amber-600">
                                                ${parseFloat(producto.precio).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Stock: {producto.stock || 'Disponible'}
                                            </div>
                                        </div>

                                        {/* Indicador de clickeable */}
                                        <div className="text-center">
                                            <span className="text-sm text-amber-600 font-medium group-hover:text-amber-800 transition-colors duration-300">
                                                Ver detalles →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Mensaje cuando no hay productos */}
                    {productosFiltrados.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full p-6 mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500">
                                {busqueda || categoriaSeleccionada 
                                    ? 'Intenta cambiar los filtros de búsqueda' 
                                    : 'Aún no hay productos disponibles en la tienda'
                                }
                            </p>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">¿Necesitas ayuda?</h3>
                            <p className="text-amber-100 mb-6">
                                Nuestro equipo está aquí para ayudarte a encontrar el café perfecto para ti.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <button className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                                    Contactar Soporte
                                </button>
                                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-colors">
                                    Ver Mi Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}