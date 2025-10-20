import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    PencilIcon, 
    CheckCircleIcon, 
    UserMinusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function UsuariosIndex() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsPerPage] = useState(10);
    const [notificacion, setNotificacion] = useState(null);

    // Cargar datos de usuarios
    const cargarUsuarios = async (page = 1, search = '') => {
        setLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(route('admin.usuarios.cargar-dt'), {
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
                    search: { value: search }
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
            setUsuarios(data.data);
            setTotalRecords(data.recordsTotal);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error loading usuarios:', error);
            if (error.message.includes('NetworkError')) {
                mostrarNotificacion('Error de conexión. Verifica tu conexión a internet.', 'error');
            } else {
                mostrarNotificacion('Error al cargar usuarios: ' + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos iniciales
    useEffect(() => {
        // Verificar si la función route está disponible
        if (typeof route === 'undefined') {
            console.error('Route function is not available');
            mostrarNotificacion('Error: Función de rutas no disponible', 'error');
            return;
        }
        
        console.log('Cargando usuarios...');
        cargarUsuarios();
    }, []);

    // Manejar búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        cargarUsuarios(1, searchTerm);
    };

    // Manejar cambio de estado del usuario
    const toggleStatus = async (usuarioId) => {
        try {
            const response = await fetch(route('admin.usuarios.toggle-status', usuarioId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();
            
            if (data.success) {
                mostrarNotificacion(data.message, 'exito');
                cargarUsuarios(currentPage, searchTerm);
            } else {
                mostrarNotificacion(data.error || 'Error al cambiar estado', 'error');
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            mostrarNotificacion('Error al cambiar estado del usuario', 'error');
        }
    };

    // Mostrar notificación
    const mostrarNotificacion = (mensaje, tipo) => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion(null), 5000);
    };

    // Calcular páginas
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-2xl font-bold text-amber-800">
                        Gestión de Usuarios
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => cargarUsuarios(currentPage, searchTerm)}
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
            <Head title="Gestión de Usuarios - Admin" />

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
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
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

                    {/* Tabla de usuarios */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pedidos
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registro
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex justify-center">
                                                    <ArrowPathIcon className="w-8 h-8 text-amber-600 animate-spin" />
                                                </div>
                                                <p className="mt-2 text-gray-500">Cargando usuarios...</p>
                                            </td>
                                        </tr>
                                    ) : usuarios.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No se encontraron usuarios
                                            </td>
                                        </tr>
                                    ) : (
                                        usuarios.map((usuario) => (
                                            <tr key={usuario.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                                                <span className="text-amber-600 font-medium text-sm">
                                                                    {usuario.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {usuario.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usuario.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        usuario.email_verified_at !== 'No verificado'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {usuario.email_verified_at !== 'No verificado' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usuario.total_pedidos} pedidos
                                                    {usuario.ultimo_pedido !== 'Nunca' && (
                                                        <div className="text-xs text-gray-400">
                                                            Último: {usuario.ultimo_pedido}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {usuario.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={route('admin.usuarios.show', usuario.id)}
                                                            className="text-amber-600 hover:text-amber-900"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('admin.usuarios.edit', usuario.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => toggleStatus(usuario.id)}
                                                            className={`${
                                                                usuario.email_verified_at !== 'No verificado'
                                                                    ? 'text-red-600 hover:text-red-900'
                                                                    : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                            title={usuario.email_verified_at !== 'No verificado' ? 'Desactivar' : 'Activar'}
                                                        >
                                                            {usuario.email_verified_at !== 'No verificado' ? (
                                                                <UserMinusIcon className="w-4 h-4" />
                                                            ) : (
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => cargarUsuarios(currentPage - 1, searchTerm)}
                                        disabled={currentPage === 1 || loading}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => cargarUsuarios(currentPage + 1, searchTerm)}
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
                                                onClick={() => cargarUsuarios(currentPage - 1, searchTerm)}
                                                disabled={currentPage === 1 || loading}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Anterior
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => cargarUsuarios(page, searchTerm)}
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
                                                onClick={() => cargarUsuarios(currentPage + 1, searchTerm)}
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
