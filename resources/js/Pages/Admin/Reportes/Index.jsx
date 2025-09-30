import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    PencilIcon,
    ChartBarIcon,
    TableCellsIcon
} from '@heroicons/react/24/outline';
import { getImagenUrl } from '@/Utils/avatarUtils';

export default function ReportesIndex() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    
    // Estados para DataTable
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(0);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filteredItems, setFilteredItems] = useState(0);

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
            
            const response = await fetch('/admin/reportes/cargar-dt', {
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

    // Efectos para cargar datos
    useEffect(() => {
        cargarDT();
        loadStats();
    }, [currentPage, itemsPerPage, searchTerm, sortColumn, sortDirection]);
    
    // Cargar datos al montar el componente
    useEffect(() => {
        cargarDT();
        loadStats();
    }, []);

    // Función para manejar ordenamiento
    const handleSort = (columnIndex) => {
        if (sortColumn === columnIndex) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnIndex);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Función para manejar búsqueda
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Función para cambiar página
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Función para cambiar items por página
    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(parseInt(value));
        setCurrentPage(1);
    };

    // Generar páginas para paginación
    const generatePagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                                <TableCellsIcon className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Reportes y Análisis
                            </h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ChartBarIcon className="w-5 h-5 text-amber-600" />
                            <span className="text-sm text-gray-600">DataTable Profesional</span>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Reportes - CafeTech" />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Estadísticas Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Total Productos</p>
                                    <p className="text-2xl font-bold text-blue-800">{stats.total_productos || 0}</p>
                                </div>
                                <div className="bg-blue-200 p-3 rounded-xl">
                                    <TableCellsIcon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Activos</p>
                                    <p className="text-2xl font-bold text-green-800">{stats.productos_activos || 0}</p>
                                </div>
                                <div className="bg-green-200 p-3 rounded-xl">
                                    <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Inactivos</p>
                                    <p className="text-2xl font-bold text-red-800">{stats.productos_inactivos || 0}</p>
                                </div>
                                <div className="bg-red-200 p-3 rounded-xl">
                                    <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
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
                                    <span className="text-amber-600 font-bold text-lg">$</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DataTable Container */}
                    <div className="bg-white shadow-2xl rounded-3xl border border-amber-200 overflow-hidden">
                        {/* Header con controles */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">DataTable de Productos</h3>
                                    <p className="text-amber-100 text-sm mt-1">
                                        {filteredItems} de {totalItems} productos
                                    </p>
                                </div>
                                
                                {/* Controles de búsqueda y paginación */}
                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar productos..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 backdrop-blur-sm"
                                        />
                                    </div>
                                    
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/90 backdrop-blur-sm"
                                    >
                                        <option value={10}>10 por página</option>
                                        <option value={25}>25 por página</option>
                                        <option value={50}>50 por página</option>
                                        <option value={100}>100 por página</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                                        {[
                                            { key: 'id', label: 'ID', sortable: true },
                                            { key: 'nombre', label: 'Producto', sortable: true },
                                            { key: 'precio', label: 'Precio', sortable: true },
                                            { key: 'stock', label: 'Stock', sortable: true },
                                            { key: 'estado', label: 'Estado', sortable: true },
                                            { key: 'created_at', label: 'Fecha', sortable: true },
                                            { key: 'acciones', label: 'Acciones', sortable: false }
                                        ].map((column, index) => (
                                            <th key={column.key} className="px-6 py-4 text-left">
                                                {column.sortable ? (
                                                    <button
                                                        onClick={() => handleSort(index)}
                                                        className="flex items-center space-x-2 text-sm font-bold text-gray-800 uppercase tracking-wider hover:text-amber-600 transition-colors"
                                                    >
                                                        <span>{column.label}</span>
                                                        {sortColumn === index && (
                                                            sortDirection === 'asc' 
                                                                ? <ArrowUpIcon className="w-4 h-4" />
                                                                : <ArrowDownIcon className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                        {column.label}
                                                    </span>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                                                </div>
                                                <p className="text-gray-500 mt-2">Cargando datos...</p>
                                            </td>
                                        </tr>
                                    ) : data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gradient-to-r hover:from-amber-25 hover:to-orange-25 transition-all duration-300">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{item.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                                                            {item.imagen_principal ? (
                                                                <img
                                                                    src={getImagenUrl(item.imagen_principal)}
                                                                    alt={item.nombre}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{item.nombre}</p>
                                                            <p className="text-sm text-gray-600">{item.categoria}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-lg font-bold text-amber-600">
                                                        ${item.precio}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                        item.stock > 10
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : item.stock > 0
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        {item.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                        item.estado === 'activo'
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${
                                                            item.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                                                        }`}></div>
                                                        {item.estado === 'activo' ? 'ACTIVO' : 'INACTIVO'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {item.fecha_creacion}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                                                            <EyeIcon className="w-4 h-4 mr-1" />
                                                            Ver
                                                        </button>
                                                        <button className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                                                            <PencilIcon className="w-4 h-4 mr-1" />
                                                            Editar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                No hay datos disponibles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="bg-amber-50 px-6 py-4 border-t border-amber-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredItems)} de {filteredItems} productos
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeftIcon className="w-4 h-4" />
                                        </button>
                                        
                                        {generatePagination().map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 text-sm rounded-lg border ${
                                                    currentPage === page
                                                        ? 'bg-amber-500 text-white border-amber-500'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRightIcon className="w-4 h-4" />
                                        </button>
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