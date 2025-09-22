import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateProducto({ categorias }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_producto_id: '',
        imagen_principal: null,
        galeria_imagenes: [],
        video_url: '',
        video_file: null,
        estado: 'activo',
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.productos.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
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

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-amber-200 px-6 py-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Crear Nuevo Producto
                    </h2>
                </div>
            }
        >
            <Head title="Crear Producto - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-2xl border border-amber-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <h3 className="text-xl font-bold text-white">Información del Producto</h3>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-6">
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
                                    rows="4"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="Describe las características y beneficios del producto..."
                                />
                                {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
                            </div>

                            {/* Precio y Stock */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
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
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="0"
                                    />
                                    {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                </div>
                            </div>

                            {/* Categoría y Estado */}
                            <div className="grid md:grid-cols-2 gap-6">
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
                                        {categorias.map(categoria => (
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
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('imagen_principal', e.target.files[0])}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.imagen_principal && <p className="mt-1 text-sm text-red-600">{errors.imagen_principal}</p>}
                            </div>

                            {/* Galería de Imágenes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Galería de Imágenes (máx. 5)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                />
                                {errors.galeria_imagenes && <p className="mt-1 text-sm text-red-600">{errors.galeria_imagenes}</p>}
                                
                                {/* Preview de imágenes */}
                                {previewImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Video */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video del Producto (opcional)
                                </label>
                                
                                {/* Opción 1: Subir archivo de video */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Subir video desde tu computadora
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    />
                                    {errors.video_file && <p className="mt-1 text-sm text-red-600">{errors.video_file}</p>}
                                    
                                    {/* Preview del video subido */}
                                    {videoPreview && (
                                        <div className="mt-3 relative inline-block">
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeVideo}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Separador */}
                                <div className="flex items-center">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-500 text-sm">o</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>

                                {/* Opción 2: URL de video */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        URL de video (YouTube, Vimeo, etc.)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.video_url}
                                        onChange={(e) => setData('video_url', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        placeholder="https://www.youtube.com/watch?v=... o cualquier URL de video"
                                    />
                                    {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url}</p>}
                                </div>

                                <p className="text-sm text-gray-500">
                                    💡 Puedes subir un video desde tu computadora o proporcionar una URL de cualquier plataforma de video.
                                </p>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('admin.productos.index')}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Creando...' : 'Crear Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}