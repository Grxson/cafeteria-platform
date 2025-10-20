import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    PencilIcon, 
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    ClockIcon,
    CheckCircleIcon,
    TruckIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function PedidosIndex() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage] = useState(10);
    const [notificacion, setNotificacion] = useState(null);

    const estados = [
        { value: '', label: 'Todos los estados' },
        { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
        { value: 'pagado', label: 'Pagado', color: 'blue' },
        { value: 'enviado', label: 'Enviado', color: 'purple' },
        { value: 'completado', label: 'Completado', color: 'green' },
        { value: 'cancelado', label: 'Cancelado', color: 'red' }
    ];

    // Cargar datos de pedidos
    const cargarPedidos = async (page = 1, search = '', estado = '') => {
        setLoading(true);
        try {
            // Verificar que la función route esté disponible
            if (typeof route === 'undefined') {
                throw new Error('Route function not available');
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(route('admin.pedidos.cargar-dt'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    draw: page,
                    start: (page - 1) * recordsPerPage,
                    length: recordsPerPage,
                    search: { value: search },
                    estado: estado
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = route('login');
                    return;
                }
                if (response.status === 403) {
                    mostrarNotificacion('No tienes permisos para acceder a esta sección', 'error');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

                const data = await response.json();
                console.log('Datos recibidos:', data.data);
                setPedidos(data.data || []);
                setTotalRecords(data.recordsTotal || 0);
                setCurrentPage(page);
        } catch (error) {
            console.error('Error loading pedidos:', error);
            if (error.message.includes('NetworkError')) {
                mostrarNotificacion('Error de conexión. Verifica tu conexión a internet.', 'error');
            } else {
                mostrarNotificacion('Error al cargar pedidos: ' + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        cargarPedidos();
    }, []);

    // Manejar búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        cargarPedidos(1, searchTerm, estadoFilter);
    };

    // Manejar cambio de estado
    const handleEstadoChange = (e) => {
        const nuevoEstado = e.target.value;
        setEstadoFilter(nuevoEstado);
        cargarPedidos(1, searchTerm, nuevoEstado);
    };

    // Cambiar estado de un pedido
    const cambiarEstado = async (pedidoId, nuevoEstado) => {
        try {
            // Verificar que la función route esté disponible
            if (typeof route === 'undefined') {
                throw new Error('Route function not available');
            }

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(route('admin.pedidos.update-status', pedidoId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = route('login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                mostrarNotificacion(data.message, 'exito');
                cargarPedidos(currentPage, searchTerm, estadoFilter);
            } else {
                mostrarNotificacion(data.error || 'Error al cambiar estado', 'error');
            }
        } catch (error) {
            console.error('Error changing status:', error);
            if (error.message.includes('NetworkError')) {
                mostrarNotificacion('Error de conexión. Verifica tu conexión a internet.', 'error');
            } else {
                mostrarNotificacion('Error al cambiar estado del pedido: ' + error.message, 'error');
            }
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
            'pagado': 'bg-blue-100 text-blue-800',
            'enviado': 'bg-purple-100 text-purple-800',
            'completado': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    // Obtener icono del estado
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

    // Calcular páginas
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                        Gestión de Pedidos
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => cargarPedidos(currentPage, searchTerm, estadoFilter)}
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
            <Head title="Gestión de Pedidos - Admin" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                                        placeholder="Buscar por ID, cliente, total..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-64">
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

                    {/* Tabla de pedidos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pedido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cliente
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Productos
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
                                            <td colSpan="8" className="px-6 py-12 text-center">
                                                <div className="flex justify-center">
                                                    <ArrowPathIcon className="w-8 h-8 text-amber-600 animate-spin" />
                                                </div>
                                                <p className="mt-2 text-gray-500">Cargando pedidos...</p>
                                            </td>
                                        </tr>
                                    ) : !pedidos || pedidos.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron pedidos
                                            </td>
                                        </tr>
                                    ) : (
                                        pedidos.map((pedido) => {
                                            const EstadoIcon = getEstadoIcon(pedido.estado);
                                            return (
                                                <tr key={pedido.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{pedido.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {pedido.cliente?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {pedido.cliente?.email || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ${parseFloat(pedido.total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                                                            <EstadoIcon className="w-3 h-3 mr-1" />
                                                            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {pedido.productos_count || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className="max-w-xs">
                                                            {console.log('Pedido:', pedido.id, 'Detalles:', pedido.detalles)}
                                                            {pedido.detalles && pedido.detalles.length > 0 ? (
                                                                <div className="space-y-1">
                                                                    {pedido.detalles.slice(0, 2).map((detalle, index) => (
                                                                        <div key={index} className="text-xs">
                                                                            {detalle.producto?.nombre || 'Producto N/A'} (x{detalle.cantidad})
                                                                        </div>
                                                                    ))}
                                                                    {pedido.detalles.length > 2 && (
                                                                        <div className="text-xs text-gray-400">
                                                                            +{pedido.detalles.length - 2} más...
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">Sin productos</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {pedido.created_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('admin.pedidos.show', pedido.id)}
                                                                className="text-amber-600 hover:text-amber-900"
                                                                title="Ver detalles"
                                                            >
                                                                <EyeIcon className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('admin.pedidos.edit', pedido.id)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Editar pedido"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Link>
                                                            {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
                                                                <select
                                                                    value={pedido.estado}
                                                                    onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                                                                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                                                                    title="Cambiar estado"
                                                                >
                                                                    <option value="pendiente">Pendiente</option>
                                                                    <option value="pagado">Pagado</option>
                                                                    <option value="enviado">Enviado</option>
                                                                    <option value="completado">Completado</option>
                                                                    <option value="cancelado">Cancelado</option>
                                                                </select>
                                                            )}
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
                                        onClick={() => cargarPedidos(currentPage - 1, searchTerm, estadoFilter)}
                                        disabled={currentPage === 1 || loading}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => cargarPedidos(currentPage + 1, searchTerm, estadoFilter)}
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
                                                onClick={() => cargarPedidos(currentPage - 1, searchTerm, estadoFilter)}
                                                disabled={currentPage === 1 || loading}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Anterior
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => cargarPedidos(page, searchTerm, estadoFilter)}
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
                                                onClick={() => cargarPedidos(currentPage + 1, searchTerm, estadoFilter)}
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
