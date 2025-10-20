import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ProductImage from '@/Components/ProductImage';
import { 
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    XCircleIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function PedidoShow({ pedido, estadisticas }) {
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

    const EstadoIcon = getEstadoIcon(pedido.estado);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.pedidos.index')}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                            Pedido #{pedido.id}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                            <EstadoIcon className="w-4 h-4 mr-1" />
                            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Pedido #${pedido.id} - Admin`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información del pedido */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información del cliente */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información del Cliente</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                                <span className="text-amber-600 font-bold text-lg">
                                                    {pedido.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-500">Nombre</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">{pedido.user.name}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-500">Email</span>
                                                    </div>
                                                    <p className="text-sm text-gray-900">{pedido.user.email}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-500">Cliente desde</span>
                                                    </div>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(pedido.user.created_at).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información de envío */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información de Envío</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Dirección</span>
                                            </div>
                                            <p className="text-sm text-gray-900">
                                                {pedido.direccion_envio || 'No especificada'}
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-500">Teléfono</span>
                                            </div>
                                            <p className="text-sm text-gray-900">
                                                {pedido.id_transaccion_pago || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Productos del pedido */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Productos del Pedido</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Producto
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cantidad
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Precio Unit.
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pedido.detalles && pedido.detalles.length > 0 ? (
                                                pedido.detalles.map((detalle, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <ProductImage
                                                                    src={detalle.producto.imagen_principal}
                                                                    alt={detalle.producto.nombre}
                                                                    className="h-10 w-10 rounded-lg object-cover"
                                                                />
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {detalle.producto.nombre}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {detalle.cantidad}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            ${parseFloat(detalle.precio_unitario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            ${(detalle.cantidad * detalle.precio_unitario).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                        No hay productos en este pedido
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cupones aplicados */}
                            {pedido.cupones && pedido.cupones.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Cupones Aplicados</h3>
                                    </div>
                                    <div className="px-6 py-4">
                                        {pedido.cupones.map((cupon, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <TagIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {cupon.codigo}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {cupon.tipo_descuento === 'porcentaje' ? 
                                                        `${cupon.valor_descuento}%` : 
                                                        `$${cupon.valor_descuento}`
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen del pedido */}
                        <div className="space-y-6">
                            {/* Resumen financiero */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Resumen del Pedido</h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal:</span>
                                        <span className="font-medium">${estadisticas.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {estadisticas.descuento_aplicado > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Descuento:</span>
                                            <span>-${estadisticas.descuento_aplicado.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total:</span>
                                            <span className="text-amber-600">${estadisticas.total_final.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del pedido */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información del Pedido</h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">ID del Pedido</div>
                                        <div className="text-sm text-gray-900">#{pedido.id}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</div>
                                        <div className="text-sm text-gray-900">
                                            {new Date(pedido.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Última Actualización</div>
                                        <div className="text-sm text-gray-900">
                                            {new Date(pedido.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Total de Productos</div>
                                        <div className="text-sm text-gray-900">{estadisticas.total_productos} productos</div>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Acciones</h3>
                                </div>
                                <div className="px-6 py-4 space-y-3">
                                    <Link
                                        href={route('admin.pedidos.edit', pedido.id)}
                                        className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center block"
                                    >
                                        Editar Pedido
                                    </Link>
                                    <Link
                                        href={route('admin.pedidos.index')}
                                        className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-center block"
                                    >
                                        Volver a la Lista
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
