import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    PencilIcon, 
    TrashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    StarIcon
} from '@heroicons/react/24/outline';

export default function ComentariosIndex() {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage] = useState(10);
    const [notificacion, setNotificacion] = useState(null);
    const [selectedComentarios, setSelectedComentarios] = useState([]);

    const estados = [
        { value: '', label: 'Todos los estados' },
        { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
        { value: 'aprobado', label: 'Aprobado', color: 'green' },
        { value: 'rechazado', label: 'Rechazado', color: 'red' }
    ];

    const tipos = [
        { value: '', label: 'Todos los tipos' },
        { value: 'con_pedido', label: 'Con Pedido', color: 'blue' },
        { value: 'libre', label: 'Libre', color: 'purple' }
    ];

    // Cargar datos de comentarios
    const cargarComentarios = async (page = 1, search = '', estado = '', tipo = '') => {
        setLoading(true);
        try {
            const response = await fetch(route('admin.comentarios.cargar-dt'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    draw: page,
                    start: (page - 1) * recordsPerPage,
                    length: recordsPerPage,
                    search: { value: search },
                    estado: estado,
                    tipo: tipo
                })
            });

            const data = await response.json();
            setComentarios(data.data);
            setTotalRecords(data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error loading comentarios:', error);
            mostrarNotificacion('Error al cargar comentarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        cargarComentarios();
    }, []);

    // Manejar búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        cargarComentarios(1, searchTerm, estadoFilter, tipoFilter);
    };

    // Manejar cambio de estado
    const handleEstadoChange = (e) => {
        const nuevoEstado = e.target.value;
        setEstadoFilter(nuevoEstado);
        cargarComentarios(1, searchTerm, nuevoEstado, tipoFilter);
    };

    // Manejar cambio de tipo
    const handleTipoChange = (e) => {
        const nuevoTipo = e.target.value;
        setTipoFilter(nuevoTipo);
        cargarComentarios(1, searchTerm, estadoFilter, nuevoTipo);
    };

    // Cambiar estado de un comentario
    const cambiarEstado = async (comentarioId, nuevoEstado) => {
        try {
            const response = await fetch(route('admin.comentarios.update-status', comentarioId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            const data = await response.json();
            
            if (data.success) {
                mostrarNotificacion(data.message, 'exito');
                cargarComentarios(currentPage, searchTerm, estadoFilter, tipoFilter);
            } else {
                mostrarNotificacion(data.error || 'Error al cambiar estado', 'error');
            }
        } catch (error) {
            console.error('Error changing status:', error);
            mostrarNotificacion('Error al cambiar estado del comentario', 'error');
        }
    };

    // Eliminar comentario
    const eliminarComentario = async (comentarioId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            return;
        }

        try {
            const response = await fetch(route('admin.comentarios.destroy', comentarioId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();
            
            if (data.success) {
                mostrarNotificacion(data.message, 'exito');
                cargarComentarios(currentPage, searchTerm, estadoFilter, tipoFilter);
            } else {
                mostrarNotificacion(data.error || 'Error al eliminar', 'error');
            }
        } catch (error) {
            console.error('Error deleting comentario:', error);
            mostrarNotificacion('Error al eliminar el comentario', 'error');
        }
    };

    // Manejar selección de comentarios
    const toggleComentarioSelection = (comentarioId) => {
        setSelectedComentarios(prev => 
            prev.includes(comentarioId) 
                ? prev.filter(id => id !== comentarioId)
                : [...prev, comentarioId]
        );
    };

    // Seleccionar/deseleccionar todos
    const toggleAllSelection = () => {
        if (selectedComentarios.length === comentarios.length) {
            setSelectedComentarios([]);
        } else {
            setSelectedComentarios(comentarios.map(c => c.id));
        }
    };

    // Actualización masiva de estado
    const bulkUpdateStatus = async (estado) => {
        if (selectedComentarios.length === 0) {
            mostrarNotificacion('Selecciona al menos un comentario', 'error');
            return;
        }

        try {
            const response = await fetch(route('admin.comentarios.bulk-update-status'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    comentario_ids: selectedComentarios,
                    estado: estado
                })
            });

            const data = await response.json();
            
            if (data.success) {
                mostrarNotificacion(data.message, 'exito');
                setSelectedComentarios([]);
                cargarComentarios(currentPage, searchTerm, estadoFilter, tipoFilter);
            } else {
                mostrarNotificacion(data.error || 'Error en actualización masiva', 'error');
            }
        } catch (error) {
            console.error('Error bulk updating:', error);
            mostrarNotificacion('Error en actualización masiva', 'error');
        }
    };

    // Mostrar notificación
    const mostrarNotificacion = (mensaje, tipo) => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 5000);
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        const colores = {
            'pendiente': 'bg-yellow-100 text-yellow-800',
            'aprobado': 'bg-green-100 text-green-800',
            'rechazado': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    // Obtener icono del estado
    const getEstadoIcon = (estado) => {
        const iconos = {
            'pendiente': ClockIcon,
            'aprobado': CheckCircleIcon,
            'rechazado': XCircleIcon
        };
        return iconos[estado] || ClockIcon;
    };

    // Renderizar estrellas de calificación
    const renderStars = (calificacion) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                        i <= calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                />
            );
        }
        return stars;
    };

    // Calcular páginas
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                        Gestión de Comentarios y Reseñas
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => cargarComentarios(currentPage, searchTerm, estadoFilter, tipoFilter)}
                            disabled={loading}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center"
                        >
                            <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Gestión de Comentarios - Admin" />

            <div className="py-6">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    {/* Notificación */}
                    {notificacion && (
                        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ${
                            notificacion.tipo === 'exito' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                        }`}>
                            {notificacion.mensaje}
                        </div>
                    )}

                    {/* Filtros y búsqueda */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por comentario, usuario, producto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-48">
                                <select
                                    value={estadoFilter}
                                    onChange={handleEstadoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    {estados.map((estado) => (
                                        <option key={estado.value} value={estado.value}>
                                            {estado.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="lg:w-48">
                                <select
                                    value={tipoFilter}
                                    onChange={handleTipoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    {tipos.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                <FunnelIcon className="w-4 h-4 mr-2" />
                                Buscar
                            </button>
                        </form>
                    </div>

                    {/* Acciones masivas */}
                    {selectedComentarios.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-700">
                                    {selectedComentarios.length} comentario(s) seleccionado(s)
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => bulkUpdateStatus('aprobado')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => bulkUpdateStatus('rechazado')}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Rechazar
                                    </button>
                                    <button
                                        onClick={() => setSelectedComentarios([])}
                                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabla de comentarios */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedComentarios.length === comentarios.length && comentarios.length > 0}
                                                onChange={toggleAllSelection}
                                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Comentario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Calificación
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center">
                                                <div className="flex justify-center">
                                                    <ArrowPathIcon className="w-8 h-8 text-amber-600 animate-spin" />
                                                </div>
                                                <p className="mt-2 text-gray-500">Cargando comentarios...</p>
                                            </td>
                                        </tr>
                                    ) : comentarios.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron comentarios
                                            </td>
                                        </tr>
                                    ) : (
                                        comentarios.map((comentario) => {
                                            const EstadoIcon = getEstadoIcon(comentario.estado);
                                            return (
                                                <tr key={comentario.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedComentarios.includes(comentario.id)}
                                                            onChange={() => toggleComentarioSelection(comentario.id)}
                                                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {comentario.usuario.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {comentario.usuario.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {comentario.producto.nombre}
                                                        </div>
                                                        {comentario.pedido_id && (
                                                            <div className="text-xs text-gray-500">
                                                                Pedido #{comentario.pedido_id}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                                            {comentario.comentario}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            {renderStars(comentario.calificacion)}
                                                            <span className="ml-1 text-sm text-gray-500">
                                                                ({comentario.calificacion}/5)
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(comentario.estado)}`}>
                                                            <EstadoIcon className="w-3 h-3 mr-1" />
                                                            {comentario.estado.charAt(0).toUpperCase() + comentario.estado.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            comentario.tipo === 'Con Pedido' 
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {comentario.tipo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {comentario.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('admin.comentarios.show', comentario.id)}
                                                                className="text-amber-600 hover:text-amber-900"
                                                                title="Ver detalles"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.comentarios.edit', comentario.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Editar comentario"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            {comentario.estado !== 'aprobado' && (
                                                                <button
                                                                    onClick={() => cambiarEstado(comentario.id, 'aprobado')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Aprobar"
                                                                >
                                                                    <CheckCircleIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {comentario.estado !== 'rechazado' && (
                                                                <button
                                                                    onClick={() => cambiarEstado(comentario.id, 'rechazado')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Rechazar"
                                                                >
                                                                    <XCircleIcon className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => eliminarComentario(comentario.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Eliminar"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => cargarComentarios(currentPage - 1, searchTerm, estadoFilter, tipoFilter)}
                                        disabled={currentPage === 1 || loading}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => cargarComentarios(currentPage + 1, searchTerm, estadoFilter, tipoFilter)}
                                        disabled={currentPage === totalPages || loading}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Mostrando{' '}
                                            <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span>
                                            {' '}a{' '}
                                            <span className="font-medium">
                                                {Math.min(currentPage * recordsPerPage, totalRecords)}
                                            </span>
                                            {' '}de{' '}
                                            <span className="font-medium">{totalRecords}</span>
                                            {' '}resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => cargarComentarios(currentPage - 1, searchTerm, estadoFilter, tipoFilter)}
                                                disabled={currentPage === 1 || loading}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Anterior
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => cargarComentarios(page, searchTerm, estadoFilter, tipoFilter)}
                                                    disabled={loading}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        page === currentPage
                                                            ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => cargarComentarios(currentPage + 1, searchTerm, estadoFilter, tipoFilter)}
                                                disabled={currentPage === totalPages || loading}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Siguiente
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
