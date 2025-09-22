import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    PencilIcon,
    CubeIcon,
    TagIcon,
    CurrencyDollarIcon,
    PhotoIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';
import { getImagenUrl } from '@/Utils/avatarUtils';

export default function ShowProducto({ producto }) {

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('admin.productos.index')}
                                className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                            </Link>
                            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                {producto.nombre}
                            </h2>
                        </div>
                        <Link
                            href={route('admin.productos.edit', producto.id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg text-sm sm:text-base text-center flex items-center gap-2"
                        >
                            <PencilIcon className="w-4 h-4" />
                            Editar Producto
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${producto.nombre} - CafeTech Admin`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                            {/* Galería de imágenes */}
                            <div className="space-y-4">
                                {/* Imagen principal */}
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    {producto.imagen_principal ? (
                                        <img
                                            src={getImagenUrl(producto.imagen_principal)}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <PhotoIcon className="w-24 h-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Galería de imágenes secundarias */}
                                {producto.galeria_imagenes && producto.galeria_imagenes.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {producto.galeria_imagenes.map((imagen, index) => (
                                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={getImagenUrl(imagen)}
                                                    alt={`${producto.nombre} - imagen ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Video */}
                                {producto.video_url && (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                        <iframe
                                            src={producto.video_url}
                                            title={`Video de ${producto.nombre}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="space-y-6">
                                {/* Estado */}
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${producto.estado === 'activo'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {producto.descripcion || 'Sin descripción disponible'}
                                    </p>
                                </div>

                                {/* Información comercial */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-amber-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CurrencyDollarIcon className="w-5 h-5 text-amber-600" />
                                            <span className="text-sm font-medium text-amber-800">Precio</span>
                                        </div>
                                        <p className="text-2xl font-bold text-amber-900">${producto.precio}</p>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CubeIcon className="w-5 h-5 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">Stock</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900">{producto.stock} unidades</p>
                                    </div>
                                </div>

                                {/* Categoría */}
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TagIcon className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-medium text-purple-800">Categoría</span>
                                    </div>
                                    <p className="text-lg font-semibold text-purple-900">
                                        {producto.categoria_producto?.nombre || 'Sin categoría'}
                                    </p>
                                </div>

                                {/* Fechas */}
                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Creado:</span>
                                        <span className="text-gray-900">
                                            {new Date(producto.created_at).toLocaleString('es-ES')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Actualizado:</span>
                                        <span className="text-gray-900">
                                            {new Date(producto.updated_at).toLocaleString('es-ES')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
