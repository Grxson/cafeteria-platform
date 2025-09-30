import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    PowerIcon,
    PlayIcon,
    PauseIcon
} from '@heroicons/react/24/outline';
import { getImagenUrl } from '@/Utils/avatarUtils';

// Compon                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>nte Modal que se renderiza en el body
function ModalEliminar({ isOpen, producto, onClose, onConfirm, procesando }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
            style={{ zIndex: 999999 }}
        >
            <div 
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-200 animate-in fade-in zoom-in duration-200"
                style={{ zIndex: 1000000 }}
            >
                <div className="flex items-center justify-center mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        ¿Eliminar Producto?
                    </h3>
                    <p className="text-gray-600 mb-2">
                        Estás a punto de eliminar permanentemente el producto:
                    </p>
                    <p className="text-lg font-semibold text-amber-600 mb-4">
                        "{producto?.nombre}"
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-700 font-medium">
                            ⚠️ Esta acción no se puede deshacer
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                            El producto se eliminará permanentemente del sistema.
                        </p>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                        disabled={procesando}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={procesando}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 border border-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        {procesando ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7938l3-2.647z"></path>
                                </svg>
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar Definitivamente'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function IndexProductos({ productos }) {
    const [procesando, setProcesando] = useState(null);
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, producto: null });

    const confirmarEliminar = (producto) => {
        setModalEliminar({ abierto: true, producto });
    };

    const eliminarProducto = async () => {
        if (!modalEliminar.producto) return;

        setProcesando(modalEliminar.producto.id);

        try {
            await router.delete(route('admin.productos.destroy', modalEliminar.producto.id));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        } finally {
            setProcesando(null);
            setModalEliminar({ abierto: false, producto: null });
        }
    };

    const toggleEstado = async (producto) => {
        setProcesando(producto.id);
        
        try {
            await router.patch(route('admin.productos.toggle-status', producto.id));
        } catch (error) {
            console.error('Error al cambiar estado del producto:', error);
        } finally {
            setProcesando(null);
        }
    };
    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Gestión de Productos
                        </h2>
                        <Link
                            href={route('admin.productos.create')}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base text-center"
                        >
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Productos - CafeTech" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {productos.data.length > 0 ? (
                        <div className="bg-white shadow-2xl rounded-3xl border border-amber-200 overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Lista de Productos</h3>
                                        <p className="text-amber-100 text-sm mt-1">{productos.total} productos registrados</p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <span className="text-white font-medium text-lg">{productos.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                                            <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-6 py-5 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Información
                                            </th>
                                            <th className="px-6 py-5 text-center text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-5 text-center text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {productos.data.map((producto) => (
                                            <tr key={producto.id} className="group hover:bg-gradient-to-r hover:from-amber-25 hover:to-orange-25 transition-all duration-300">
                                                {/* Columna Producto */}
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                                                {producto.imagen_principal ? (
                                                                    <img
                                                                        src={getImagenUrl(producto.imagen_principal)}
                                                                        alt={producto.nombre}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-amber-900 transition-colors">
                                                                {producto.nombre}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                                {producto.descripcion}
                                                            </p>
                                                            <div className="flex items-center space-x-3">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                                                                    {producto.categoria_producto?.nombre || 'Sin categoría'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Columna Información */}
                                                <td className="px-6 py-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">Precio:</span>
                                                            <span className="text-xl font-bold text-amber-600">
                                                                ${parseFloat(producto.precio).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">Stock:</span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                                producto.stock > 10
                                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                                    : producto.stock > 0
                                                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                            }`}>
                                                                {producto.stock} units
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Columna Estado */}
                                                <td className="px-6 py-6 text-center">
                                                    <div className="flex flex-col items-center space-y-3">
                                                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm border-2 ${
                                                            producto.estado === 'activo'
                                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200'
                                                                : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200'
                                                        }`}>
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                                producto.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                                                            }`}></div>
                                                            {producto.estado === 'activo' ? 'ACTIVO' : 'INACTIVO'}
                                                        </span>

                                                        {/* Toggle Status Button */}
                                                        <button
                                                            onClick={() => toggleEstado(producto)}
                                                            disabled={procesando === producto.id}
                                                            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                producto.estado === 'activo'
                                                                    ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                                    : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                            } disabled:opacity-50 shadow-sm`}
                                                            title={producto.estado === 'activo' ? 'Desactivar producto' : 'Activar producto'}
                                                        >
                                                            {procesando === producto.id ? (
                                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                                            ) : producto.estado === 'activo' ? (
                                                                <PauseIcon className="w-4 h-4 mr-2" />
                                                            ) : (
                                                                <PlayIcon className="w-4 h-4 mr-2" />
                                                            )}
                                                            {producto.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                        </button>
                                                    </div>
                                                </td>
                                                {/* Columna Acciones */}
                                                <td className="px-6 py-6 text-center">
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            {/* Ver producto */}
                                                            <Link
                                                                href={route('admin.productos.show', producto.id)}
                                                                className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200 shadow-sm"
                                                                title="Ver detalles"
                                                            >
                                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                                Ver
                                                            </Link>

                                                            {/* Editar producto */}
                                                            <Link
                                                                href={route('admin.productos.edit', producto.id)}
                                                                className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 shadow-sm"
                                                                title="Editar producto"
                                                            >
                                                                <PencilIcon className="w-4 h-4 mr-1" />
                                                                Editar
                                                            </Link>
                                                        </div>

                                                        {/* Eliminar producto - Solo si está inactivo */}
                                                        {producto.estado === 'inactivo' && (
                                                            <button
                                                                onClick={() => confirmarEliminar(producto)}
                                                                disabled={procesando === producto.id}
                                                                className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all duration-200 shadow-sm disabled:opacity-50"
                                                                title="Eliminar producto permanentemente"
                                                            >
                                                                {procesando === producto.id ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                                                                        Eliminando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TrashIcon className="w-4 h-4 mr-1" />
                                                                        Eliminar
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
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
                                                    className={`px-3 py-2 text-sm rounded-lg ${link.active
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

            {/* Modal usando Portal */}
            <ModalEliminar
                isOpen={modalEliminar.abierto}
                producto={modalEliminar.producto}
                onClose={() => setModalEliminar({abierto: false, producto: null})}
                onConfirm={eliminarProducto}
                procesando={procesando}
            />
            {false && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-lg flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-red-200 relative z-[100000]">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                ¿Eliminar Producto?
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Estás a punto de eliminar permanentemente el producto:
                            </p>
                            <p className="text-lg font-semibold text-amber-600 mb-4">
                                "{modalEliminar.producto?.nombre}"
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-sm text-red-700 font-medium">
                                    ⚠️ Esta acción no se puede deshacer
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                    El producto se eliminará permanentemente del sistema.
                                </p>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setModalEliminar({abierto: false, producto: null})}
                                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all duration-200 shadow-sm"
                                disabled={procesando}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarProducto}
                                disabled={procesando}
                                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 border border-red-600 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center"
                            >
                                {procesando && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7938l3-2.647z"></path>
                                    </svg>
                                )}
                                {procesando ? 'Eliminando...' : 'Eliminar Definitivamente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
