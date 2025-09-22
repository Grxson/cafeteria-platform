import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    MinusIcon,
    PlusIcon,
    TrashIcon,
    ShoppingCartIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from '@/Components/Modals/ConfirmationModal';
import { useConfirmation } from '@/Hooks/useConfirmation';

export default function Carrito({ carrito }) {
    const [actualizando, setActualizando] = useState({});
    const [eliminando, setEliminando] = useState({});
    const { 
        modalState, 
        hideModal, 
        confirmDeleteProduct, 
        confirmClearCart, 
        showError, 
        showSuccess 
    } = useConfirmation();

    const actualizarCantidad = async (carritoProductoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;

        setActualizando(prev => ({ ...prev, [carritoProductoId]: true }));

        try {
            const response = await fetch(route('clientes.carrito.actualizar', carritoProductoId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });

            if (response.ok) {
                // Recargar la página para mostrar los cambios
                router.reload();
            } else {
                const data = await response.json();
                showError(data.message || 'Error al actualizar la cantidad', 'No pudimos actualizar la cantidad');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Verifica tu conexión a internet e inténtalo de nuevo', 'Error de conexión');
        } finally {
            setActualizando(prev => ({ ...prev, [carritoProductoId]: false }));
        }
    };

    const eliminarProducto = async (carritoProductoId, nombreProducto) => {
        const confirmed = await confirmDeleteProduct(nombreProducto);
        if (!confirmed) return;

        setEliminando(prev => ({ ...prev, [carritoProductoId]: true }));

        try {
            const response = await fetch(route('clientes.carrito.quitar', carritoProductoId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                }
            });

            if (response.ok) {
                router.reload();
            } else {
                const data = await response.json();
                showError(data.message || 'Error al eliminar el producto', 'No pudimos eliminar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Verifica tu conexión a internet e inténtalo de nuevo', 'Error de conexión');
        } finally {
            setEliminando(prev => ({ ...prev, [carritoProductoId]: false }));
        }
    };

    const vaciarCarrito = async () => {
        const confirmed = await confirmClearCart();
        if (!confirmed) return;

        try {
            const response = await fetch(route('clientes.carrito.vaciar'), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                }
            });

            if (response.ok) {
                router.reload();
            } else {
                const data = await response.json();
                showError(data.message || 'Error al vaciar el carrito', 'No pudimos vaciar el carrito');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Verifica tu conexión a internet e inténtalo de nuevo', 'Error de conexión');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-amber-800">
                        Mi Carrito de Compras
                    </h2>
                    {carrito.productos.length > 0 && (
                        <button
                            onClick={vaciarCarrito}
                            className="px-4 py-2 text-sm text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                        >
                            Vaciar Carrito
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Mi Carrito - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {carrito.productos.length === 0 ? (
                        // Carrito vacío
                        <div className="p-8 text-center bg-white border shadow-lg rounded-2xl border-amber-200 sm:p-12">
                            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full shadow-inner sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-orange-100">
                                <ShoppingCartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:text-2xl">Tu carrito está vacío</h3>
                            <p className="max-w-md mx-auto mb-8 text-sm leading-relaxed text-gray-600 sm:text-base">
                                ¡Descubre nuestros deliciosos productos de cafetería y llena tu carrito con sabores increíbles!
                            </p>
                            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <a
                                    href={route('clientes.tienda')}
                                    className="inline-flex items-center px-6 py-3 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-xl hover:scale-105"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                                    </svg>
                                    Explorar Tienda
                                </a>
                                <div className="text-center">
                                    <p className="mb-1 text-xs text-gray-500">¿Tienes un cupón?</p>
                                    <button className="text-sm font-medium underline transition-colors text-amber-600 hover:text-amber-700">
                                        Aplicar descuento
                                    </button>
                                </div>
                            </div>

                            {/* Beneficios destacados */}
                            <div className="pt-8 mt-8 border-t border-gray-200">
                                <h4 className="mb-4 text-lg font-semibold text-gray-800">¿Por qué elegir CafeTech?</h4>
                                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8 mb-2 bg-green-100 rounded-full">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-600">Envío Gratis</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8 mb-2 bg-blue-100 rounded-full">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-600">Entrega Rápida</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center justify-center w-8 h-8 mb-2 rounded-full bg-amber-100">
                                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                            </svg>
                                        </div>
                                        <span className="font-medium text-gray-600">Productos Frescos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Carrito con productos
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Lista de productos */}
                            <div className="space-y-4 lg:col-span-2">
                                <div className="overflow-hidden bg-white border shadow-lg rounded-2xl border-amber-200">
                                    <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                        <h3 className="text-lg font-semibold text-amber-800">
                                            Productos en tu carrito ({carrito.cantidad_productos} items)
                                        </h3>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        {carrito.productos.map((item) => (
                                            <div key={item.id} className="relative p-4 transition-colors sm:p-6 hover:bg-gray-50">
                                                {/* Diseño mobile-first con grid responsivo */}
                                                <div className="grid items-start grid-cols-12 gap-4">
                                                    {/* Imagen del producto - más grande y adaptable */}
                                                    <div className="col-span-3 sm:col-span-2">
                                                        <div className="aspect-square w-full max-w-[120px] mx-auto">
                                                            <img
                                                                src={item.producto.imagen_principal || '/images/placeholder-product.jpg'}
                                                                alt={item.producto.nombre}
                                                                className="object-cover w-full h-full border border-gray-200 shadow-lg rounded-xl"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Información del producto - layout mejorado */}
                                                    <div className="col-span-9 space-y-2 sm:col-span-6">
                                                        <div>
                                                            <h4 className="text-base font-bold leading-tight text-gray-900 sm:text-lg">
                                                                {item.producto.nombre}
                                                            </h4>
                                                            <p className="mt-1 text-xs text-gray-600 sm:text-sm" style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}>
                                                                {item.producto.descripcion}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-amber-100 text-amber-800">
                                                                {item.producto.categoria}
                                                            </span>
                                                            {item.producto.stock <= 5 && (
                                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-md">
                                                                    Pocas unidades
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Precio unitario</p>
                                                                <p className="text-lg font-bold sm:text-xl text-amber-700">
                                                                    ${parseFloat(item.precio_unitario).toFixed(2)}
                                                                </p>
                                                            </div>

                                                            {/* Controles de cantidad - mejor diseño móvil */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="hidden text-xs text-gray-500 sm:block">Cantidad:</span>
                                                                <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
                                                                    <button
                                                                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                                                        disabled={item.cantidad <= 1 || actualizando[item.id]}
                                                                        className="flex items-center justify-center w-8 h-8 transition-colors rounded-l-lg sm:w-10 sm:h-10 text-amber-600 hover:bg-amber-50 disabled:text-gray-400 disabled:hover:bg-transparent"
                                                                    >
                                                                        <MinusIcon className="w-4 h-4" />
                                                                    </button>

                                                                    <div className="flex items-center justify-center w-12 h-8 border-gray-300 sm:w-16 sm:h-10 border-x bg-gray-50">
                                                                        <span className="text-sm font-bold text-gray-900 sm:text-base">
                                                                            {item.cantidad}
                                                                        </span>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                                                        disabled={item.cantidad >= item.producto.stock || actualizando[item.id]}
                                                                        className="flex items-center justify-center w-8 h-8 transition-colors rounded-r-lg sm:w-10 sm:h-10 text-amber-600 hover:bg-amber-50 disabled:text-gray-400 disabled:hover:bg-transparent"
                                                                    >
                                                                        <PlusIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Subtotal y acciones - layout vertical mejorado */}
                                                    <div className="col-span-12 pt-4 border-t sm:col-span-4 sm:border-t-0 sm:pt-0">
                                                        <div className="flex items-center justify-between h-full gap-4 sm:flex-col sm:justify-start sm:items-end">
                                                            {/* Subtotal prominente */}
                                                            <div className="text-center sm:text-right">
                                                                <p className="mb-1 text-xs text-gray-500 sm:text-sm">Subtotal</p>
                                                                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                                                                    ${parseFloat(item.subtotal).toFixed(2)}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    {item.cantidad} x ${parseFloat(item.precio_unitario).toFixed(2)}
                                                                </p>
                                                            </div>

                                                            {/* Botón eliminar mejorado */}
                                                            <div className="flex gap-2 sm:flex-col">
                                                                <button
                                                                    onClick={() => eliminarProducto(item.id, item.producto.nombre)}
                                                                    disabled={eliminando[item.id]}
                                                                    className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 transition-all duration-200 bg-white border border-red-300 rounded-lg shadow-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group"
                                                                >
                                                                    <TrashIcon className="w-4 h-4 mr-1 transition-transform sm:mr-0 sm:mb-1 group-hover:scale-110" />
                                                                    <span className="sm:hidden">Eliminar</span>
                                                                </button>

                                                                {item.producto.stock <= 5 && (
                                                                    <div className="text-center sm:text-right">
                                                                        <p className="text-xs font-medium text-orange-600">
                                                                            Solo {item.producto.stock} disponibles
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Indicador de carga */}
                                                {(actualizando[item.id] || eliminando[item.id]) && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                                                        <div className="flex items-center gap-2 text-amber-600">
                                                            <div className="w-5 h-5 border-b-2 rounded-full animate-spin border-amber-600"></div>
                                                            <span className="text-sm font-medium">
                                                                {actualizando[item.id] ? 'Actualizando...' : 'Eliminando...'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Resumen del pedido */}
                            <div className="lg:col-span-1">
                                <div className="sticky overflow-hidden bg-white border shadow-lg rounded-2xl border-amber-200 top-6">
                                    <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-amber-800">
                                                Resumen del Pedido
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Desglose de productos */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-gray-700">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                    Productos ({carrito.cantidad_productos} items)
                                                </span>
                                                <span className="font-semibold">${parseFloat(carrito.total).toFixed(2)}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-gray-700">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                    Envío
                                                </span>
                                                <span className="flex items-center gap-1 font-semibold text-green-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Gratis
                                                </span>
                                            </div>

                                            {/* Descuentos (si existieran) */}
                                            <div className="flex items-center justify-between text-gray-700">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                                    Descuentos
                                                </span>
                                                <button className="text-sm font-medium text-purple-600 underline transition-colors hover:text-purple-700">
                                                    Aplicar cupón
                                                </button>
                                            </div>
                                        </div>

                                        <hr className="border-amber-200" />

                                        {/* Total destacado */}
                                        <div className="p-4 border bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-amber-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-gray-800">Total a pagar</span>
                                                <span className="text-2xl font-bold text-amber-700">
                                                    ${parseFloat(carrito.total).toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">IVA incluido</p>
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="space-y-3">
                                            <button
                                                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                                onClick={() => showInfo('Estamos trabajando en esta funcionalidad. ¡Próximamente podrás completar tu compra!', '¡Pronto disponible! ☕')}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                                </svg>
                                                Proceder al Pago
                                            </button>

                                            <a
                                                href={route('clientes.tienda')}
                                                className="block w-full px-6 py-3 font-semibold text-center text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-300 hover:bg-gray-200 rounded-xl hover:border-gray-400"
                                            >
                                                ← Continuar Comprando
                                            </a>
                                        </div>

                                        {/* Información adicional */}
                                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="mb-1 text-sm font-semibold text-blue-800">¿Necesitas ayuda?</h4>
                                                    <p className="text-xs text-blue-700">
                                                        Envío gratis en pedidos mayores a $50.
                                                        <button className="ml-1 underline hover:no-underline">
                                                            Ver términos
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={hideModal}
                onConfirm={modalState.onConfirm}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                icon={modalState.icon}
            />
        </AuthenticatedLayout>
    );
}
