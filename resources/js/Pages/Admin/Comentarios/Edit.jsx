import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    StarIcon
} from '@heroicons/react/24/outline';

export default function ComentarioEdit({ comentario }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        estado: comentario.estado || 'pendiente',
        comentario: comentario.comentario || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.comentarios.update', comentario.id), {
            onSuccess: () => {
                // El controlador manejará la redirección
            },
        });
    };

    const estados = [
        { value: 'pendiente', label: 'Pendiente', icon: ClockIcon, color: 'yellow' },
        { value: 'aprobado', label: 'Aprobado', icon: CheckCircleIcon, color: 'green' },
        { value: 'rechazado', label: 'Rechazado', icon: XCircleIcon, color: 'red' }
    ];

    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'aprobado': 'bg-green-100 text-green-800',
            'rechazado': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

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
                            href={route('admin.comentarios.show', comentario.id)}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                            Editar Comentario #{comentario.id}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Editar Comentario #${comentario.id} - Admin`} />

            <div className="py-6">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Información del Comentario</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Modera y edita el comentario del usuario
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                            {/* Estado del comentario */}
                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado del Comentario
                                </label>
                                <select
                                    id="estado"
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                        errors.estado ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    {estados.map((estado) => {
                                        const EstadoIcon = estado.icon;
                                        return (
                                            <option key={estado.value} value={estado.value}>
                                                {estado.label}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.estado && (
                                    <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                                )}
                                
                                {/* Vista previa del estado */}
                                <div className="mt-3">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-500 mr-2">Vista previa:</span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(data.estado)}`}>
                                            {estados.find(s => s.value === data.estado)?.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Comentario */}
                            <div>
                                <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
                                    Comentario del Usuario
                                </label>
                                <textarea
                                    id="comentario"
                                    rows={6}
                                    value={data.comentario}
                                    onChange={(e) => setData('comentario', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                        errors.comentario ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Edita el comentario del usuario..."
                                />
                                {errors.comentario && (
                                    <p className="mt-1 text-sm text-red-600">{errors.comentario}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Puedes editar el contenido del comentario si es necesario.
                                </p>
                            </div>

                            {/* Información del comentario original */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Información del Comentario</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">ID:</span> #{comentario.id}
                                    </div>
                                    <div>
                                        <span className="font-medium">Usuario:</span> {comentario.user?.name || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Producto:</span> {comentario.producto?.nombre || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Calificación:</span> 
                                        <div className="flex items-center mt-1">
                                            {renderStars(comentario.calificacion)}
                                            <span className="ml-1 text-xs text-gray-500">
                                                ({comentario.calificacion}/5)
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Tipo:</span> {comentario.pedido_id ? 'Con Pedido' : 'Libre'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Creado:</span> {new Date(comentario.created_at).toLocaleDateString('es-ES')}
                                    </div>
                                </div>
                            </div>

                            {/* Información sobre estados */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Estados del Comentario</h4>
                                <div className="text-xs text-blue-700 space-y-1">
                                    <div><strong>Pendiente:</strong> Comentario esperando moderación</div>
                                    <div><strong>Aprobado:</strong> Comentario visible para todos los usuarios</div>
                                    <div><strong>Rechazado:</strong> Comentario oculto para los usuarios</div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('admin.comentarios.show', comentario.id)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Guardar Cambios'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
