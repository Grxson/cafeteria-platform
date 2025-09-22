import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ChevronLeftIcon,
    LightBulbIcon,
    CheckCircleIcon,
    MinusIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { getAvatarUrl, getImagenUrl } from '@/Utils/avatarUtils';

export default function ProductoDetalle({ cliente, producto, productosRelacionados, estadisticasComentarios, puedeComentarInfo }) {
    const [cantidad, setCantidad] = useState(1);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(
        producto.imagen_principal ? getImagenUrl(producto.imagen_principal) : null
    );
    const [mostrarFormularioComentario, setMostrarFormularioComentario] = useState(false);
    const [notificacion, setNotificacion] = useState(null);
    const [nuevoComentario, setNuevoComentario] = useState({
        pedido_id: '',
        calificacion: 5,
        comentario: ''
    });
    const [comentarios, setComentarios] = useState(producto.comentarios || []);
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [agregandoCarrito, setAgregandoCarrito] = useState(false);

    const incrementarCantidad = () => {
        if (cantidad < producto.stock) {
            setCantidad(cantidad + 1);
        }
    };

    const decrementarCantidad = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    };

    // Funciones auxiliares para manejo de medios
    const getVideoUrl = () => {
        // Priorizar video_file (subido) sobre video_url
        if (producto.video_file) {
            return `/storage/${producto.video_file}`;
        }
        return producto.video_url || null;
    };

    const isVideoFile = () => {
        return !!producto.video_file;
    };

    const agregarAlCarrito = async () => {
        if (cantidad > producto.stock) {
            setNotificacion({
                mensaje: 'No hay suficiente stock disponible',
                tipo: 'error'
            });
            setTimeout(() => setNotificacion(null), 5000);
            return;
        }

        setAgregandoCarrito(true);

        try {
            const response = await fetch(route('clientes.carrito.agregar'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    producto_id: producto.id,
                    cantidad: cantidad
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Mostrar notificación de éxito con el mensaje del servidor
                const mensaje = data.message || `¡${cantidad} ${producto.nombre}${cantidad > 1 ? 's' : ''} agregado${cantidad > 1 ? 's' : ''} al carrito!`;
                setNotificacion({
                    mensaje: mensaje,
                    tipo: 'exito'
                });
                setTimeout(() => setNotificacion(null), 5000);

                // Actualizar contador del carrito si existe el evento
                const evento = new CustomEvent('carritoActualizado', { detail: data.carrito_count });
                window.dispatchEvent(evento);

                // Resetear cantidad a 1
                setCantidad(1);
            } else {
                setNotificacion({
                    mensaje: data.message || 'Error al agregar el producto al carrito',
                    tipo: 'error'
                });
                setTimeout(() => setNotificacion(null), 5000);
            }
        } catch (error) {
            console.error('Error:', error);
            setNotificacion({
                mensaje: 'Error al conectar con el servidor',
                tipo: 'error'
            });
            setTimeout(() => setNotificacion(null), 5000);
        } finally {
            setAgregandoCarrito(false);
        }
    };

    const enviarComentario = async () => {
        if (!nuevoComentario.pedido_id || !nuevoComentario.calificacion) {
            alert('Por favor, selecciona un pedido y una calificación.');
            return;
        }

        setEnviandoComentario(true);

        try {
            const response = await fetch(route('clientes.comentarios.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    producto_id: producto.id,
                    pedido_id: nuevoComentario.pedido_id,
                    calificacion: nuevoComentario.calificacion,
                    comentario: nuevoComentario.comentario,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Agregar el nuevo comentario a la lista
                setComentarios([data.comentario, ...comentarios]);

                // Limpiar el formulario
                setNuevoComentario({
                    pedido_id: '',
                    calificacion: 5,
                    comentario: ''
                });

                // Ocultar el formulario
                setMostrarFormularioComentario(false);

                alert('¡Gracias por tu comentario! Ha sido publicado exitosamente.');
            } else {
                alert(data.message || 'Error al enviar el comentario.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar el comentario. Por favor, inténtalo de nuevo.');
        } finally {
            setEnviandoComentario(false);
        }
    };

    const renderizarEstrellas = (calificacion, size = 'w-5 h-5') => {
        return [1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`${size} ${star <= calificacion ? 'text-amber-400' : 'text-gray-300'} fill-current`}
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Link
                        href={route('clientes.tienda')}
                        className="transition-colors text-amber-600 hover:text-amber-800"
                    >
                        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Link>
                    <h2 className="text-lg sm:text-2xl font-bold text-amber-800 truncate">
                        {producto.nombre}
                    </h2>
                </div>
            }
        >
            <Head title={`${producto.nombre} - CafeTech`} />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Contenido principal del producto */}
                    <div className="mb-8 overflow-hidden bg-white border shadow-xl rounded-2xl border-amber-200">
                        <div className="grid gap-6 sm:gap-8 p-4 sm:p-8 lg:grid-cols-2">
                            {/* Galería de imágenes */}
                            <div className="space-y-4">
                                {/* Imagen principal */}
                                <div className="overflow-hidden aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                                    {imagenSeleccionada ? (
                                        <img
                                            src={imagenSeleccionada}
                                            alt={producto.nombre}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <div className="text-center">
                                                <LightBulbIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 text-amber-400" />
                                                <p className="font-medium text-amber-600 text-sm sm:text-base">{producto.nombre}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Miniaturas de galería */}
                                {producto.galeria_imagenes && producto.galeria_imagenes.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {producto.imagen_principal && (
                                            <button
                                                onClick={() => setImagenSeleccionada(getImagenUrl(producto.imagen_principal))}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${imagenSeleccionada === getImagenUrl(producto.imagen_principal)
                                                    ? 'border-amber-500'
                                                    : 'border-gray-200 hover:border-amber-300'
                                                    }`}
                                            >
                                                <img src={getImagenUrl(producto.imagen_principal)} alt={producto.nombre} className="object-cover w-full h-full" />
                                            </button>
                                        )}
                                        {producto.galeria_imagenes.map((imagen, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setImagenSeleccionada(getImagenUrl(imagen))}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${imagenSeleccionada === getImagenUrl(imagen)
                                                    ? 'border-amber-500'
                                                    : 'border-gray-200 hover:border-amber-300'
                                                    }`}
                                            >
                                                <img src={getImagenUrl(imagen)} alt={`${producto.nombre} ${index + 1}`} className="object-cover w-full h-full" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                                        <span className="inline-block px-3 py-1 text-xs sm:text-sm rounded-full bg-amber-100 text-amber-800 w-fit">
                                            {producto.categoria_producto?.nombre}
                                        </span>
                                        <div className="flex items-center">
                                            {renderizarEstrellas(Math.round(estadisticasComentarios.promedio_calificacion), 'w-4 h-4 sm:w-5 sm:h-5')}
                                            <span className="ml-2 text-xs sm:text-sm text-gray-600">
                                                ({estadisticasComentarios.total_comentarios} {estadisticasComentarios.total_comentarios === 1 ? 'reseña' : 'reseñas'})
                                            </span>
                                        </div>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{producto.nombre}</h1>
                                </div>

                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-600">
                                    ${parseFloat(producto.precio).toFixed(2)}
                                </div>

                                {producto.descripcion && (
                                    <div>
                                        <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">Descripción</h3>
                                        <p className="leading-relaxed text-gray-700 text-sm sm:text-base">{producto.descripcion}</p>
                                    </div>
                                )}

                                {/* Selector de cantidad y botón de compra */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Cantidad
                                        </label>
                                        <div className="flex items-center justify-center sm:justify-start space-x-4">
                                            <button
                                                onClick={decrementarCantidad}
                                                disabled={cantidad <= 1}
                                                className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <MinusIcon className="w-5 h-5" />
                                            </button>
                                            <span className="w-16 text-xl font-semibold text-center">{cantidad}</span>
                                            <button
                                                onClick={incrementarCantidad}
                                                disabled={cantidad >= producto.stock}
                                                className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={agregarAlCarrito}
                                        disabled={agregandoCarrito || producto.stock === 0}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {agregandoCarrito ? (
                                            <>
                                                <svg className="w-6 h-6 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                </svg>
                                                Agregando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l2.5 5m0 0h8M7 13h10M4 7h16"></path>
                                                </svg>
                                                {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Video del producto (si existe) */}
                        {getVideoUrl() && (
                            <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                                <h3 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">Video del Producto</h3>
                                <div className="overflow-hidden bg-black rounded-lg aspect-video">
                                    {isVideoFile() ? (
                                        <video
                                            src={getVideoUrl()}
                                            controls
                                            className="w-full h-full object-contain"
                                            preload="metadata"
                                        >
                                            Tu navegador no soporta la reproducción de videos.
                                        </video>
                                    ) : (
                                        <iframe
                                            src={getVideoUrl()}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title={`Video de ${producto.nombre}`}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de comentarios y calificaciones */}
                    <div className="p-4 sm:p-8 mb-8 bg-white border shadow-xl rounded-2xl border-amber-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Reseñas y Comentarios</h3>
                            {puedeComentarInfo.puede_comentar && (
                                <button
                                    onClick={() => setMostrarFormularioComentario(!mostrarFormularioComentario)}
                                    className="px-4 py-2 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-sm sm:text-base"
                                >
                                    {mostrarFormularioComentario ? 'Cancelar' : 'Escribir Reseña'}
                                </button>
                            )}
                        </div>

                        {/* Estadísticas de calificaciones */}
                        {estadisticasComentarios.total_comentarios > 0 && (
                            <div className="p-4 sm:p-6 mb-6 border rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="text-center">
                                        <div className="mb-2 text-3xl sm:text-4xl font-bold text-amber-600">
                                            {estadisticasComentarios.promedio_calificacion}
                                        </div>
                                        <div className="flex justify-center mb-2">
                                            {renderizarEstrellas(Math.round(estadisticasComentarios.promedio_calificacion), 'w-5 h-5 sm:w-6 sm:h-6')}
                                        </div>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            Basado en {estadisticasComentarios.total_comentarios} {estadisticasComentarios.total_comentarios === 1 ? 'reseña' : 'reseñas'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((estrellas) => (
                                            <div key={estrellas} className="flex items-center">
                                                <span className="w-3 text-sm font-medium text-gray-700">{estrellas}</span>
                                                <svg className="w-4 h-4 mx-1 fill-current text-amber-400" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <div className="flex-1 mx-2">
                                                    <div className="h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-2 transition-all duration-300 rounded-full bg-amber-400"
                                                            style={{ width: `${estadisticasComentarios.distribucion_calificaciones[estrellas]?.percentage || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="w-8 text-sm text-gray-600">
                                                    {estadisticasComentarios.distribucion_calificaciones[estrellas]?.count || 0}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Formulario para agregar comentario */}
                        {mostrarFormularioComentario && (
                            <div className="p-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
                                <h4 className="mb-4 text-lg font-semibold text-gray-900">Escribe tu reseña</h4>

                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Selecciona el pedido
                                        </label>
                                        <select
                                            value={nuevoComentario.pedido_id}
                                            onChange={(e) => setNuevoComentario({ ...nuevoComentario, pedido_id: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="">-- Selecciona un pedido --</option>
                                            {puedeComentarInfo.pedidos_disponibles.map((pedido) => (
                                                <option key={pedido.id} value={pedido.id}>
                                                    Pedido #{pedido.id} - {pedido.fecha} (${pedido.total})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Calificación
                                        </label>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setNuevoComentario({ ...nuevoComentario, calificacion: star })}
                                                    className="focus:outline-none"
                                                >
                                                    <svg
                                                        className={`w-8 h-8 ${star <= nuevoComentario.calificacion ? 'text-amber-400' : 'text-gray-300'} fill-current hover:text-amber-400 transition-colors`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Tu comentario (opcional)
                                    </label>
                                    <textarea
                                        value={nuevoComentario.comentario}
                                        onChange={(e) => setNuevoComentario({ ...nuevoComentario, comentario: e.target.value })}
                                        placeholder="Comparte tu experiencia con este producto..."
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        maxLength="1000"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {nuevoComentario.comentario.length}/1000 caracteres
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={enviarComentario}
                                        disabled={enviandoComentario || !nuevoComentario.pedido_id}
                                        className="px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {enviandoComentario ? 'Enviando...' : 'Publicar Reseña'}
                                    </button>
                                    <button
                                        onClick={() => setMostrarFormularioComentario(false)}
                                        className="px-6 py-3 text-gray-700 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de comentarios */}
                        {comentarios && comentarios.length > 0 ? (
                            <div className="space-y-4">
                                {comentarios.map((comentario) => (
                                    <div key={comentario.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {comentario.user?.avatar_url ? (
                                                    <img
                                                        src={getAvatarUrl(comentario.user.avatar_url)}
                                                        alt={comentario.user.name}
                                                        className="object-cover w-10 h-10 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500">
                                                        <span className="text-sm font-semibold text-white">
                                                            {comentario.user?.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-gray-900">{comentario.user?.name}</h4>
                                                    <div className="flex items-center">
                                                        {renderizarEstrellas(comentario.calificacion, 'w-4 h-4')}
                                                    </div>
                                                </div>
                                                {comentario.comentario && (
                                                    <p className="mt-2 text-gray-700">{comentario.comentario}</p>
                                                )}
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {new Date(comentario.created_at).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-gray-500">Aún no hay reseñas para este producto.</p>
                                <p className="mt-1 text-sm text-gray-400">¡Sé el primero en dejar una reseña!</p>
                            </div>
                        )}
                    </div>

                    {/* Productos relacionados */}
                    {productosRelacionados && productosRelacionados.length > 0 && (
                        <div className="p-4 sm:p-8 bg-white border shadow-xl rounded-2xl border-amber-200">
                            <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">Productos Relacionados</h3>
                            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                {productosRelacionados.map((productoRelacionado) => (
                                    <Link
                                        key={productoRelacionado.id}
                                        href={route('clientes.producto.show', productoRelacionado.id)}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 h-[180px] sm:h-[220px] flex flex-col">
                                            <div className="flex items-center justify-center flex-shrink-0 h-20 sm:h-32 bg-gradient-to-br from-amber-100 to-orange-100">
                                                {productoRelacionado.imagen_principal ? (
                                                    <img
                                                        src={getImagenUrl(productoRelacionado.imagen_principal)}
                                                        alt={productoRelacionado.nombre}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex flex-col flex-grow p-3 sm:p-4">
                                                <h4 className="flex-grow mb-2 text-xs sm:text-sm font-semibold text-gray-900 transition-colors group-hover:text-amber-600 line-clamp-2">
                                                    {productoRelacionado.nombre}
                                                </h4>
                                                <div className="mt-auto text-sm sm:text-lg font-bold text-amber-600">
                                                    ${parseFloat(productoRelacionado.precio).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Notificación animada */}
            {notificacion && (
                <div className={`fixed top-36 right-4 z-[9999999] px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl transform transition-all duration-500 ${notificacion.tipo === 'exito'
                    ? 'bg-green-500 text-white border-l-4 border-green-600'
                    : 'bg-red-500 text-white border-l-4 border-red-600'
                    } animate-pulse hover:animate-none cursor-pointer max-w-sm backdrop-blur-sm border border-white/20`}
                    style={{zIndex: 999999999}}
                    onClick={() => setNotificacion(null)}>
                    <div className="flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-2 flex-1">
                            {notificacion.tipo === 'exito' ? (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            )}
                            <span className="font-medium text-sm sm:text-base flex-1">{notificacion.mensaje}</span>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setNotificacion(null);
                            }}
                            className="ml-2 text-white hover:text-gray-200 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
