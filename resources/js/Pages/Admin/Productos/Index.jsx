import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function IndexProductos({ productos }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Gestión de Productos
                        </h2>
                        <Link
                            href={route('admin.productos.create')}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg"
                        >
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Productos - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {productos.data.length > 0 ? (
                        <div className="bg-white shadow-xl rounded-2xl border border-amber-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                                <h3 className="text-xl font-bold text-white">Lista de Productos ({productos.total})</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-amber-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Producto</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoría</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Precio</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Stock</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                                            <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {productos.data.map((producto) => (
                                            <tr key={producto.id} className="hover:bg-amber-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                                                            {producto.imagen_principal ? (
                                                                <img 
                                                                    src={`/storage/${producto.imagen_principal}`} 
                                                                    alt={producto.nombre}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{producto.nombre}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-1">
                                                                {producto.descripcion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {producto.categoria_producto?.nombre || 'Sin categoría'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-lg font-semibold text-amber-600">
                                                        ${parseFloat(producto.precio).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        producto.stock > 10 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : producto.stock > 0 
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {producto.stock} unidades
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        producto.estado === 'activo' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800 p-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                            </svg>
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800 p-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800 p-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {productos.links && productos.links.length > 3 && (
                                <div className="bg-amber-50 px-6 py-4 border-t border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {productos.from} - {productos.to} de {productos.total} productos
                                        </div>
                                        <div className="flex space-x-2">
                                            {productos.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 text-sm rounded-lg ${
                                                        link.active 
                                                            ? 'bg-amber-500 text-white' 
                                                            : 'bg-white text-gray-700 hover:bg-amber-100'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white shadow-xl rounded-2xl border border-amber-200 p-12 text-center">
                            <div className="bg-amber-100 rounded-full p-6 mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay productos registrados</h3>
                            <p className="text-gray-500 mb-6">Comienza creando tu primer producto para la cafetería.</p>
                            <Link
                                href={route('admin.productos.create')}
                                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Crear Primer Producto
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}