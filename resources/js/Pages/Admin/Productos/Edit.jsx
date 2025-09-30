import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getImagenUrl } from '@/Utils/avatarUtils';

export default function EditProducto({ producto, categorias }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        stock: producto.stock || '',
        categoria_producto_id: producto.categoria_producto_id || '',
        imagen_principal: null,
        galeria_imagenes: [],
        video_url: producto.video_url || '',
        video_file: null,
        estado: producto.estado || 'activo',
        _method: 'PUT'
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);
    const [mantieneImagenPrincipal, setMantieneImagenPrincipal] = useState(true);
    const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
    const [modalConfirmacion, setModalConfirmacion] = useState({ 
        mostrar: false, 
        imagenIndex: null,
        mensaje: ''
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Crear FormData para enviar correctamente los archivos y arrays
        const formData = new FormData();
        
        // Agregar datos básicos
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === 'galeria_imagenes' && Array.isArray(data[key])) {
                    // Agregar archivos de galería
                    data[key].forEach(file => {
                        formData.append('galeria_imagenes[]', file);
                    });
                } else if (key !== 'galeria_imagenes') {
                    formData.append(key, data[key]);
                }
            }
        });
        
        // Agregar imágenes a eliminar
        if (imagenesAEliminar.length > 0) {
            imagenesAEliminar.forEach(index => {
                formData.append('imagenes_a_eliminar[]', index);
            });
        }
        
        post(route('admin.productos.update', producto.id), {
            data: formData,
            forceFormData: true
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('galeria_imagenes', files);

        // Crear previews
        const previews = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setPreviewImages(previews);
    };

    const removeImage = (index) => {
        const newFiles = data.galeria_imagenes.filter((_, i) => i !== index);
        setData('galeria_imagenes', newFiles);

        const newPreviews = previewImages.filter((_, i) => i !== index);
        setPreviewImages(newPreviews);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('video_file', file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setData('video_file', null);
        setVideoPreview(null);
    };

    const handleImagenPrincipalChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('imagen_principal', file);
            setMantieneImagenPrincipal(false);
        }
    };

    const eliminarImagenGaleria = (index) => {
        setModalConfirmacion({
            mostrar: true,
            imagenIndex: index,
            mensaje: `¿Estás seguro de que quieres eliminar la imagen ${index + 1} de la galería?`
        });
    };

    const confirmarEliminacion = () => {
        const { imagenIndex } = modalConfirmacion;
        const nuevasImagenesAEliminar = [...imagenesAEliminar, imagenIndex];
        setImagenesAEliminar(nuevasImagenesAEliminar);
        setModalConfirmacion({ mostrar: false, imagenIndex: null, mensaje: '' });
    };

    const cancelarEliminacion = () => {
        setModalConfirmacion({ mostrar: false, imagenIndex: null, mensaje: '' });
    };

    const restaurarImagenGaleria = (index) => {
        const nuevasImagenesAEliminar = imagenesAEliminar.filter(i => i !== index);
        setImagenesAEliminar(nuevasImagenesAEliminar);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.productos.index')}
                            className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Editar Producto: {producto.nombre}
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Editar ${producto.nombre} - CafeTech`} />

            <div className="py-4 sm:py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Información del Producto</h3>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-8">
                            {/* Primera fila: Información básica */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                {/* Columna 1: Datos principales */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Producto *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Ej: Café Americano"
                                        />
                                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={data.descripcion}
                                            onChange={(e) => setData('descripcion', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Describe tu producto..."
                                        />
                                        {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                                    </div>

                                    {/* Precio, Stock y Categoría en una fila */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Precio *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.precio}
                                                onChange={(e) => setData('precio', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="0.00"
                                            />
                                            {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock *
                                            </label>
                                            <input
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="0"
                                            />
                                            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Estado *
                                            </label>
                                            <select
                                                value={data.estado}
                                                onChange={(e) => setData('estado', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                            {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                                        </div>
                                    </div>

                                    {/* Categoría */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoría *
                                        </label>
                                        <select
                                            value={data.categoria_producto_id}
                                            onChange={(e) => setData('categoria_producto_id', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.categoria_producto_id && <p className="mt-1 text-sm text-red-600">{errors.categoria_producto_id}</p>}
                                    </div>
                                </div>

                                {/* Columna 2: Imagen Principal */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Imagen Principal
                                        </label>
                                        {mantieneImagenPrincipal && producto.imagen_principal && (
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-600 mb-2">Imagen actual:</p>
                                                <div className="w-full max-w-xs mx-auto">
                                                    <img
                                                        src={getImagenUrl(producto.imagen_principal)}
                                                        alt="Imagen actual"
                                                        className="w-full h-48 object-cover rounded-lg border shadow-md"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImagenPrincipalChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {mantieneImagenPrincipal && producto.imagen_principal
                                                ? 'Seleccionar para reemplazar'
                                                : 'Imagen principal del producto'
                                            }
                                        </p>
                                        {errors.imagen_principal && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal}</p>}
                                    </div>
                                </div>
                            </div>
                            {/* Segunda fila: Galería y Video lado a lado */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* Galería de Imágenes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Galería de Imágenes
                                    </label>
                                    <div className="space-y-3">
                                        {/* Imágenes actuales */}
                                        {producto.galeria_imagenes && producto.galeria_imagenes.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-3">Imágenes actuales:</p>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                                    {producto.galeria_imagenes.map((imagen, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={getImagenUrl(imagen)}
                                                                alt={`Galería ${index + 1}`}
                                                                className={`w-full h-20 object-cover rounded-lg border-2 transition-all duration-200 ${
                                                                    imagenesAEliminar.includes(index) 
                                                                    ? 'border-red-500 opacity-50 grayscale' 
                                                                    : 'border-gray-200 hover:border-amber-300'
                                                                }`}
                                                            />
                                                            {!imagenesAEliminar.includes(index) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => eliminarImagenGaleria(index)}
                                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                                                >
                                                                    <XMarkIcon className="w-3 h-3" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => restaurarImagenGaleria(index)}
                                                                    className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 shadow-md"
                                                                    title="Restaurar imagen"
                                                                >
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            {imagenesAEliminar.includes(index) && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-lg">
                                                                    <span className="text-red-600 font-semibold text-xs bg-white px-2 py-1 rounded shadow">
                                                                        Se eliminará
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {imagenesAEliminar.length > 0 && (
                                                    <p className="text-xs text-red-600 mt-2">
                                                        Se eliminarán {imagenesAEliminar.length} imagen(es) al actualizar
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />

                                        {/* Nuevas imágenes seleccionadas */}
                                        {previewImages.length > 0 && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-3">Nuevas imágenes seleccionadas:</p>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                                    {previewImages.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={preview.url}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-20 object-cover rounded-lg border-2 border-green-200 hover:border-green-400 transition-all duration-200"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                                            >
                                                                <XMarkIcon className="w-3 h-3" />
                                                            </button>
                                                            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded shadow">
                                                                Nueva
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            Seleccionar nuevas imágenes reemplaza la galería actual
                                        </p>
                                    </div>
                                    {errors.galeria_imagenes && <p className="mt-1 text-sm text-red-600">{errors.galeria_imagenes}</p>}
                                </div>

                                {/* Video del Producto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Video del Producto
                                    </label>
                                    <div className="space-y-4">
                                        {/* Video actual si existe */}
                                        {producto.video_url && !videoPreview && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">Video actual:</p>
                                                <div className="relative">
                                                    {producto.video_url.includes('youtube.com') || producto.video_url.includes('youtu.be') ? (
                                                        <iframe
                                                            src={producto.video_url}
                                                            className="w-full h-48 rounded-lg border"
                                                            frameBorder="0"
                                                            allowFullScreen
                                                        ></iframe>
                                                    ) : (
                                                        <video
                                                            src={producto.video_url}
                                                            controls
                                                            className="w-full h-48 rounded-lg border"
                                                        >
                                                            Tu navegador no soporta el elemento de video.
                                                        </video>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* URL del video */}
                                        <div>
                                            <input
                                                type="url"
                                                value={data.video_url}
                                                onChange={(e) => setData('video_url', e.target.value)}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                                placeholder="https://www.youtube.com/embed/..."
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                URL del video (YouTube, Vimeo, etc.)
                                            </p>
                                        </div>

                                        {/* O archivo de video */}
                                        <div className="text-center text-sm text-gray-500 font-medium">- O -</div>
                                        <div>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Subir archivo de video (reemplazará el video actual)
                                            </p>
                                        </div>

                                        {/* Preview del nuevo video */}
                                        {videoPreview && (
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">Nuevo video seleccionado:</p>
                                                <div className="relative">
                                                    <video
                                                        src={videoPreview}
                                                        controls
                                                        className="w-full h-48 rounded-lg border-2 border-green-200"
                                                    >
                                                        Tu navegador no soporta el elemento de video.
                                                    </video>
                                                    <button
                                                        type="button"
                                                        onClick={removeVideo}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-md"
                                                    >
                                                        <XMarkIcon className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-sm px-2 py-1 rounded shadow">
                                                        Nuevo video
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
                                    {errors.video_file && <p className="mt-1 text-sm text-red-600">{errors.video_file}</p>}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg"
                                >
                                    {processing ? 'Actualizando...' : 'Actualizar Producto'}
                                </button>
                                <Link
                                    href={route('admin.productos.index')}
                                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación para eliminar imágenes */}
            {modalConfirmacion.mostrar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-200">
                        <div className="flex items-center justify-center mb-6">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                                <XMarkIcon className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-sm text-gray-600">
                                {modalConfirmacion.mensaje}
                            </p>
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-4">
                                <p className="text-xs text-gray-600">
                                    Esta acción marcará la imagen para ser eliminada cuando guardes los cambios del producto.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={cancelarEliminacion}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarEliminacion}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
