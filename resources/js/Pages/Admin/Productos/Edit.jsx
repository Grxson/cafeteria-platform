import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.productos.update', producto.id), {
            forceFormData: true
        });
    };

    const getImagenUrl = (imagen) => {
        if (!imagen) return null;
        return imagen.startsWith('http') ? imagen : `/storage/${imagen}`;
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

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Información del Producto</h3>
                        </div>

                        <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Producto *
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Describe tu producto..."
                                />
                                {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                            </div>

                            {/* Precio y Stock */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            </div>

                            {/* Categoría y Estado */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                            {/* Imagen Principal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen Principal
                                </label>
                                <div className="space-y-4">
                                    {mantieneImagenPrincipal && producto.imagen_principal && (
                                        <div className="relative">
                                            <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                                            <img
                                                src={getImagenUrl(producto.imagen_principal)}
                                                alt="Imagen actual"
                                                className="w-32 h-32 object-cover rounded-lg border"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImagenPrincipalChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {mantieneImagenPrincipal && producto.imagen_principal 
                                            ? 'Selecciona un archivo para reemplazar la imagen actual'
                                            : 'Selecciona la imagen principal del producto'
                                        }
                                    </p>
                                </div>
                                {errors.imagen_principal && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal}</p>}
                            </div>

                            {/* Galería de Imágenes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Galería de Imágenes
                                </label>
                                <div className="space-y-4">
                                    {/* Imágenes actuales */}
                                    {producto.galeria_imagenes && producto.galeria_imagenes.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {producto.galeria_imagenes.map((imagen, index) => (
                                                    <img
                                                        key={index}
                                                        src={getImagenUrl(imagen)}
                                                        alt={`Galería ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded border"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    
                                    {/* Nuevas imágenes seleccionadas */}
                                    {previewImages.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Nuevas imágenes seleccionadas:</p>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {previewImages.map((preview, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={preview.url}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-20 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <XMarkIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Selecciona nuevas imágenes para reemplazar completamente la galería actual
                                    </p>
                                </div>
                                {errors.galeria_imagenes && <p className="mt-1 text-sm text-red-600">{errors.galeria_imagenes}</p>}
                            </div>

                            {/* Video */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video del Producto
                                </label>
                                <div className="space-y-4">
                                    {/* URL del video */}
                                    <div>
                                        <input
                                            type="url"
                                            value={data.video_url}
                                            onChange={(e) => setData('video_url', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="https://www.youtube.com/embed/..."
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            URL del video (YouTube, Vimeo, etc.)
                                        </p>
                                    </div>

                                    {/* O archivo de video */}
                                    <div className="text-center text-gray-500">- O -</div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Subir archivo de video
                                        </p>
                                    </div>

                                    {/* Preview del video */}
                                    {videoPreview && (
                                        <div className="relative">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full max-w-md rounded-lg"
                                            >
                                                Tu navegador no soporta el elemento de video.
                                            </video>
                                            <button
                                                type="button"
                                                onClick={removeVideo}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
                                {errors.video_file && <p className="mt-1 text-sm text-red-600">{errors.video_file}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
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
        </AuthenticatedLayout>
    );
}