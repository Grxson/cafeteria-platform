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
    PauseIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    CubeIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { getImagenUrl } from '@/Utils/avatarUtils';
import Toast from '@/Components/Toast';
import { useNotification } from '@/Hooks/useNotification';

// Componente Modal que se renderiza en el body
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
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Producto:</strong> {producto?.nombre}
                        </p>
                        <p className="text-sm text-gray-600">
                            Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
                        </p>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={procesando}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={procesando}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                        {procesando ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Eliminando...
                            </div>
                        ) : (
                            'Eliminar'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// Componente Modal para desactivar productos
function ModalDesactivar({ isOpen, producto, onClose, onConfirm, procesando }) {
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
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-200 animate-in fade-in zoom-in duration-200"
                style={{ zIndex: 1000000 }}
            >
                <div className="flex items-center justify-center mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                        <PauseIcon className="w-8 h-8 text-amber-600" />
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        ¿Desactivar Producto?
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Producto:</strong> {producto?.nombre}
                        </p>
                        <p className="text-sm text-gray-600">
                            El producto será desactivado y no estará disponible para los clientes, pero podrás reactivarlo cuando quieras.
                        </p>
                    </div>
                </div>
                
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={procesando}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={procesando}
                        className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
                    >
                        {procesando ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Desactivando...
                            </div>
                        ) : (
                            'Desactivar'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function Index() {
    // Hook de notificaciones
    const { notification, showNotification, hideNotification } = useNotification();
    
    // Estados del DataTable
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [filteredItems, setFilteredItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState(0);
    const [sortDirection, setSortDirection] = useState('asc');
    
    // Estados para estadísticas
    const [stats, setStats] = useState({
        total_productos: 0,
        productos_activos: 0,
        productos_inactivos: 0,
        stock_total: 0,
        valor_inventario: 0
    });
    
    // Estados para acciones
    const [procesando, setProcesando] = useState(null);
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, producto: null });
    const [modalDesactivar, setModalDesactivar] = useState({ abierto: false, producto: null });

    // Cargar estadísticas
    const loadStats = async () => {
        try {
            const response = await fetch('/admin/reportes/estadisticas');
            const statsData = await response.json();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    // Función principal cargarDT
    const cargarDT = async () => {
        setLoading(true);
        try {
            const params = {
                draw: 1,
                start: (currentPage - 1) * itemsPerPage,
                length: itemsPerPage,
                search: { value: searchTerm },
                order: [{
                    column: sortColumn,
                    dir: sortDirection
                }]
            };

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/admin/productos/cargar-dt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('DataTable response:', result); // Para debug
            
            setData(result.data || []);
            setTotalItems(result.recordsTotal || 0);
            setFilteredItems(result.recordsFiltered || 0);
            setTotalPages(Math.ceil((result.recordsFiltered || 0) / itemsPerPage));
        } catch (error) {
            console.error('Error loading data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (columnIndex) => {
        if (sortColumn === columnIndex) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnIndex);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        cargarDT();
        loadStats();
    }, [currentPage, itemsPerPage, searchTerm, sortColumn, sortDirection]);
    
    // Cargar datos al montar el componente
    useEffect(() => {
        cargarDT();
        loadStats();
    }, []);

    // Funciones para acciones de productos
    const confirmarEliminar = (producto) => {
        setModalEliminar({ abierto: true, producto });
    };

    const confirmarDesactivar = (producto) => {
        setModalDesactivar({ abierto: true, producto });
    };

    const desactivarProducto = async () => {
        if (!modalDesactivar.producto) return;

        setProcesando(modalDesactivar.producto.id);

        try {
            await router.patch(route('admin.productos.deactivate', modalDesactivar.producto.id));
            await cargarDT();
            await loadStats();
            showNotification('Producto desactivado correctamente', 'success');
        } catch (error) {
            console.error('Error al desactivar producto:', error);
            showNotification('Error al desactivar el producto', 'error');
        } finally {
            setProcesando(null);
            setModalDesactivar({ abierto: false, producto: null });
        }
    };

    const eliminarProducto = async () => {
        if (!modalEliminar.producto) return;

        setProcesando(modalEliminar.producto.id);

        try {
            await router.delete(route('admin.productos.delete', modalEliminar.producto.id));
            // Recargar datos después de eliminar
            await cargarDT();
            await loadStats();
            showNotification('Producto eliminado correctamente', 'success');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            showNotification('Error al eliminar el producto', 'error');
        } finally {
            setProcesando(null);
            setModalEliminar({ abierto: false, producto: null });
        }
    };

    const toggleEstado = async (producto) => {
        setProcesando(producto.id);
        
        try {
            await router.patch(route('admin.productos.toggle-status', producto.id));
            // Recargar datos después de cambiar estado
            await cargarDT();
            await loadStats();
            const mensaje = producto.estado === 'activo' ? 'Producto desactivado correctamente' : 'Producto activado correctamente';
            showNotification(mensaje, 'success');
        } catch (error) {
            console.error('Error al cambiar estado del producto:', error);
            showNotification('Error al cambiar el estado del producto', 'error');
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
            <Head title="Productos" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Estadísticas Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Total Productos</p>
                                    <p className="text-2xl font-bold text-blue-800">{stats.total_productos || 0}</p>
                                </div>
                                <div className="bg-blue-200 p-3 rounded-xl">
                                    <CubeIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Productos Activos</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.productos_activos || 0}</p>
                                </div>
                                <div className="bg-green-200 p-3 rounded-xl">
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Stock Total</p>
                                    <p className="text-2xl font-bold text-purple-800">{stats.stock_total || 0}</p>
                                </div>
                                <div className="bg-purple-200 p-3 rounded-xl">
                                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-2xl border border-amber-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-amber-600 font-medium">Valor Inventario</p>
                                    <p className="text-xl font-bold text-amber-800">${Number(stats.valor_inventario || 0).toFixed(2)}</p>
                                </div>
                                <div className="bg-amber-200 p-3 rounded-xl">
                                    <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DataTable */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-amber-800">Lista de Productos</h3>
                                    <p className="text-sm text-amber-600">
                                        Mostrando {data.length} de {filteredItems} productos
                                        {searchTerm && ` (filtrado de ${totalItems} total)`}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value={5}>5 por página</option>
                                        <option value={10}>10 por página</option>
                                        <option value={25}>25 por página</option>
                                        <option value={50}>50 por página</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            onClick={() => handleSort(1)}
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-2/5"
                                        >
                                            Producto {sortColumn === 1 && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            onClick={() => handleSort(2)}
                                            className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                                        >
                                            Precio {sortColumn === 2 && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            onClick={() => handleSort(3)}
                                            className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                                        >
                                            Stock {sortColumn === 3 && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th 
                                            onClick={() => handleSort(4)}
                                            className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/6"
                                        >
                                            Estado {sortColumn === 4 && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center">
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin h-8 w-8 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="ml-2 text-gray-600">Cargando productos...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No se encontraron productos
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((producto) => (
                                            <tr key={producto.id} className="hover:bg-gray-50">
                                                {/* Producto con imagen, nombre, descripción y categoría */}
                                                <td className="px-3 py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <img 
                                                            src={getImagenUrl(producto.imagen_principal)} 
                                                            alt={producto.nombre}
                                                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</div>
                                                            <div className="text-xs text-gray-500 truncate">{producto.descripcion}</div>
                                                            <span className="inline-flex px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mt-1">
                                                                {producto.categoria}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Precio */}
                                                <td className="px-2 py-3 text-center">
                                                    <span className="text-sm font-semibold text-green-600">${producto.precio}</span>
                                                </td>
                                                {/* Stock */}
                                                <td className="px-2 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        producto.stock > 10 ? 'bg-green-100 text-green-800' :
                                                        producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {producto.stock}
                                                    </span>
                                                </td>
                                                {/* Estado */}
                                                <td className="px-2 py-3 text-center">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        producto.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {producto.estado}
                                                    </span>
                                                </td>
                                                {/* Acciones */}
                                                <td className="px-2 py-3 text-center">
                                                    <div className="flex items-center justify-center space-x-1">
                                                        {/* Ver */}
                                                        <Link
                                                            href={route('admin.productos.show', producto.id)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                                            title="Ver producto"
                                                        >
                                                            <EyeIcon className="w-3.5 h-3.5" />
                                                        </Link>

                                                        {/* Editar */}
                                                        <Link
                                                            href={route('admin.productos.edit', producto.id)}
                                                            className="text-amber-600 hover:text-amber-900 p-1 rounded transition-colors"
                                                            title="Editar producto"
                                                        >
                                                            <PencilIcon className="w-3.5 h-3.5" />
                                                        </Link>

                                                        {/* Toggle Estado */}
                                                        <button
                                                            onClick={() => {
                                                                if (producto.estado === 'activo') {
                                                                    confirmarDesactivar(producto);
                                                                } else {
                                                                    toggleEstado(producto);
                                                                }
                                                            }}
                                                            disabled={procesando === producto.id}
                                                            className={`p-1 rounded transition-colors ${
                                                                producto.estado === 'activo' 
                                                                    ? 'text-red-600 hover:text-red-900' 
                                                                    : 'text-green-600 hover:text-green-900'
                                                            }`}
                                                            title={producto.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                        >
                                                            {procesando === producto.id ? (
                                                                <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : producto.estado === 'activo' ? (
                                                                <PauseIcon className="w-3.5 h-3.5" />
                                                            ) : (
                                                                <PlayIcon className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>

                                                        {/* Eliminar (solo si está inactivo) */}
                                                        {producto.estado === 'inactivo' && (
                                                            <button
                                                                onClick={() => confirmarEliminar(producto)}
                                                                disabled={procesando === producto.id}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                                                title="Eliminar producto"
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
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
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        ({filteredItems} registros total)
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeftIcon className="w-4 h-4" />
                                    </button>
                                    
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                        if (pageNumber > totalPages) return null;
                                        
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                                    currentPage === pageNumber
                                                        ? 'bg-amber-600 text-white'
                                                        : 'border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRightIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ModalEliminar
                isOpen={modalEliminar.abierto}
                producto={modalEliminar.producto}
                onClose={() => setModalEliminar({ abierto: false, producto: null })}
                onConfirm={eliminarProducto}
                procesando={procesando === modalEliminar.producto?.id}
            />

            {/* Modal de confirmación de desactivación */}
            <ModalDesactivar
                isOpen={modalDesactivar.abierto}
                producto={modalDesactivar.producto}
                onClose={() => setModalDesactivar({ abierto: false, producto: null })}
                onConfirm={desactivarProducto}
                procesando={procesando === modalDesactivar.producto?.id}
            />

            {/* Toast de notificaciones */}
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </AuthenticatedLayout>
    );
}