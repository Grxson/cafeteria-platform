import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import ProductImage from '@/Components/ProductImage';
import { 
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    CalendarIcon,
    StarIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ShoppingBagIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function ComentarioShow({ comentario }) {
    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'aprobado': 'bg-green-100 text-green-800',
            'rechazado': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoIcon = (estado) => {
        const iconos = {
            'pendiente': ClockIcon,
            'aprobado': CheckCircleIcon,
            'rechazado': XCircleIcon
        };
        return iconos[estado] || ClockIcon;
    };

    const EstadoIcon = getEstadoIcon(comentario.estado);

    // Renderizar estrellas de calificación
    const renderStars = (calificacion) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`w-6 h-6 ${
                        i <= calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
            );
        }
        return stars;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.comentarios.index')}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                            Comentario #{comentario.id}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(comentario.estado)}`}>
                            <EstadoIcon className="w-4 h-4 mr-1" />
                            {comentario.estado.charAt(0).toUpperCase() + comentario.estado.slice(1)}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Comentario #${comentario.id} - Admin`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información del comentario */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Información del usuario */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información del Usuario</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                                                <span className="text-amber-600 font-bold text-lg">
                                                    {comentario.user.name.charAt(0).toUpperCase()}
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
                                                    <p className="text-sm font-semibold text-gray-900">{comentario.user.name}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-500">Email</span>
                                                    </div>
                                                    <p className="text-sm text-gray-900">{comentario.user.email}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm font-medium text-gray-500">Usuario desde</span>
                                                    </div>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(comentario.user.created_at).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del producto */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Producto Comentado</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="flex items-start space-x-4">
                                        <ProductImage
                                            src={comentario.producto.imagen_principal}
                                            alt={comentario.producto.nombre}
                                            className="h-16 w-16 rounded-lg object-cover"
                                            fallbackClassName="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {comentario.producto.nombre}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Precio: ${parseFloat(comentario.producto.precio).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                            <Link
                                                href={route('clientes.producto.show', comentario.producto.id)}
                                                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                            >
                                                Ver producto →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comentario completo */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Comentario y Calificación</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="mb-4">
                                        <div className="flex items-center mb-2">
                                            <span className="text-sm font-medium text-gray-500 mr-2">Calificación:</span>
                                            <div className="flex items-center">
                                                {renderStars(comentario.calificacion)}
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({comentario.calificacion}/5)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-2">Comentario:</div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap">
                                                {comentario.comentario}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información del pedido (si aplica) */}
                            {comentario.pedido && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Información del Pedido</h3>
                                    </div>
                                    <div className="px-6 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 mb-1">ID del Pedido</div>
                                                <div className="text-sm text-gray-900">#{comentario.pedido.id}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 mb-1">Total</div>
                                                <div className="text-sm text-gray-900">
                                                    ${parseFloat(comentario.pedido.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500 mb-1">Estado</div>
                                                <div className="text-sm text-gray-900">
                                                    {comentario.pedido.estado.charAt(0).toUpperCase() + comentario.pedido.estado.slice(1)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-sm font-medium text-gray-500 mb-1">Fecha del Pedido</div>
                                            <div className="text-sm text-gray-900">
                                                {new Date(comentario.pedido.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen del comentario */}
                        <div className="space-y-6">
                            {/* Estado del comentario */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Estado del Comentario</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="text-center">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getEstadoColor(comentario.estado)}`}>
                                            <EstadoIcon className="w-5 h-5 mr-2" />
                                            {comentario.estado.charAt(0).toUpperCase() + comentario.estado.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-600">
                                        {comentario.estado === 'pendiente' && (
                                            <p>Este comentario está esperando moderación.</p>
                                        )}
                                        {comentario.estado === 'aprobado' && (
                                            <p>Este comentario ha sido aprobado y es visible para los usuarios.</p>
                                        )}
                                        {comentario.estado === 'rechazado' && (
                                            <p>Este comentario ha sido rechazado y no es visible para los usuarios.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Información del comentario */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Información del Comentario</h3>
                                </div>
                                <div className="px-6 py-4 space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">ID del Comentario</div>
                                        <div className="text-sm text-gray-900">#{comentario.id}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Tipo</div>
                                        <div className="text-sm text-gray-900">
                                            {comentario.pedido_id ? 'Con Pedido' : 'Libre'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</div>
                                        <div className="text-sm text-gray-900">
                                            {new Date(comentario.created_at).toLocaleDateString('es-ES', {
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
                                            {new Date(comentario.updated_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
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
                                        href={route('admin.comentarios.edit', comentario.id)}
                                        className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center block"
                                    >
                                        Editar Comentario
                                    </Link>
                                    <Link
                                        href={route('admin.comentarios.index')}
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
