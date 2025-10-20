import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UsuarioShow({ usuario, estadisticas }) {
    const [expandedPedidos, setExpandedPedidos] = useState(new Set());
    const [deletingPedido, setDeletingPedido] = useState(null);
    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'pagado': 'bg-blue-100 text-blue-800',
            'enviado': 'bg-purple-100 text-purple-800',
            'completado': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoIcon = (estado) => {
        const iconos = {
            'pendiente': ClockIcon,
            'pagado': CheckCircleIcon,
            'enviado': TruckIcon,
            'completado': CheckCircleIcon,
            'cancelado': XCircleIcon
        };
        return iconos[estado] || ClockIcon;
    };

    const togglePedidoExpansion = (pedidoId) => {
        const newExpanded = new Set(expandedPedidos);
        if (newExpanded.has(pedidoId)) {
            newExpanded.delete(pedidoId);
        } else {
            newExpanded.add(pedidoId);
        }
        setExpandedPedidos(newExpanded);
    };

    const handleDeletePedido = async (pedidoId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) {
            return;
        }

        setDeletingPedido(pedidoId);
        try {
            const response = await fetch(route('admin.pedidos.destroy', pedidoId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                // Recargar la página para actualizar los datos
                window.location.reload();
            } else {
                alert('Error al eliminar el pedido');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el pedido');
        } finally {
            setDeletingPedido(null);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.usuarios.index')}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                            Detalles del Usuario
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`${usuario.name} - Admin`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Información del usuario */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex items-start space-x-6">
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                                        <span className="text-amber-600 font-bold text-2xl">
                                            {usuario.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Nombre</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{usuario.name}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Email</span>
                                            </div>
                                            <p className="text-lg text-gray-900">{usuario.email}</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Fecha de Registro</span>
                                            </div>
                                            <p className="text-lg text-gray-900">
                                                {new Date(usuario.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <CheckCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Estado de Cuenta</span>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                usuario.email_verified_at 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {usuario.email_verified_at ? 'Verificado' : 'No Verificado'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
                                    <p className="text-2xl font-semibold text-gray-900">{estadisticas.total_pedidos}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Gastado</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ${estadisticas.total_gastado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Pedidos Completados</p>
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.pedidos_completados}</p>
                                    </div>
                                </div>
                            </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <ClockIcon className="w-8 h-8 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Pedidos Pendientes</p>
                                    <p className="text-2xl font-semibold text-gray-900">{estadisticas.pedidos_pendientes}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial de pedidos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Historial de Pedidos</h3>
                        </div>
                        <div className="overflow-x-auto">
                            {usuario.pedidos && usuario.pedidos.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pedido
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Productos
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {usuario.pedidos.map((pedido) => {
                                            const EstadoIcon = getEstadoIcon(pedido.estado);
                                            const isExpanded = expandedPedidos.has(pedido.id);
                                            return (
                                                <React.Fragment key={pedido.id}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            <button
                                                                onClick={() => togglePedidoExpansion(pedido.id)}
                                                                className="flex items-center hover:text-amber-600"
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronDownIcon className="w-4 h-4 mr-2" />
                                                                ) : (
                                                                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                                                                )}
                                                                #{pedido.id}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(pedido.created_at).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                                                                <EstadoIcon className="w-3 h-3 mr-1" />
                                                                {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${parseFloat(pedido.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {pedido.detalles ? pedido.detalles.length : 0} productos
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <button
                                                                onClick={() => handleDeletePedido(pedido.id)}
                                                                disabled={deletingPedido === pedido.id}
                                                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                                title="Eliminar pedido"
                                                            >
                                                                {deletingPedido === pedido.id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <TrashIcon className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && pedido.detalles && pedido.detalles.length > 0 && (
                                                        <tr>
                                                            <td colSpan="6" className="px-6 py-4 bg-gray-50">
                                                                <div className="space-y-2">
                                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Productos del pedido:</h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {pedido.detalles.map((detalle, index) => (
                                                                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                                                                <div className="flex items-center space-x-3">
                                                                                    {detalle.producto?.imagen_principal ? (
                                                                                        <img
                                                                                            src={detalle.producto.imagen_principal}
                                                                                            alt={detalle.producto.nombre}
                                                                                            className="w-12 h-12 object-cover rounded-lg"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                                            <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                                            {detalle.producto?.nombre || 'Producto no disponible'}
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-500">
                                                                                            Cantidad: {detalle.cantidad}
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-500">
                                                                                            Precio: ${parseFloat(detalle.precio_unitario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                                                        </p>
                                                                                        <p className="text-sm font-medium text-gray-900">
                                                                                            Subtotal: ${(detalle.cantidad * detalle.precio_unitario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    <ShoppingBagIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>Este usuario no ha realizado ningún pedido</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <Link
                            href={route('admin.usuarios.index')}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                            Volver a la Lista
                        </Link>
                        <Link
                            href={route('admin.usuarios.edit', usuario.id)}
                            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Editar Usuario
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
