import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductoDetalle({ cliente, producto, productosRelacionados, estadisticasComentarios, puedeComentarInfo }) {
    const [cantidad, setCantidad] = useState(1);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(producto.imagen_principal || null);
    const [mostrarFormularioComentario, setMostrarFormularioComentario] = useState(false);
    const [nuevoComentario, setNuevoComentario] = useState({
        pedido_id: '',
        calificacion: 5,
        comentario: ''
    });
    const [comentarios, setComentarios] = useState(producto.comentarios || []);
    const [enviandoComentario, setEnviandoComentario] = useState(false);

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

    const agregarAlCarrito = () => {
        // TODO: Implementar lógica de agregar al carrito
        console.log(`Agregando ${cantidad} unidades de ${producto.nombre} al carrito`);
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
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('clientes.tienda')}
                        className="text-amber-600 hover:text-amber-800 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-2xl font-bold text-amber-800">
                        {producto.nombre}
                    </h2>
                </div>
            }
        >
            <Head title={`${producto.nombre} - CafeTech`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Contenido principal del producto */}
                    <div className="bg-white shadow-xl rounded-2xl border border-amber-200 overflow-hidden mb-8">
                        <div className="grid md:grid-cols-2 gap-8 p-8">
                            {/* Galería de imágenes */}
                            <div className="space-y-4">
                                {/* Imagen principal */}
                                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl overflow-hidden">
                                    {imagenSeleccionada ? (
                                        <img 
                                            src={imagenSeleccionada} 
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-24 h-24 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                                </svg>
                                                <p className="text-amber-600 font-medium">{producto.nombre}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Miniaturas de galería */}
                                {producto.galeria_imagenes && producto.galeria_imagenes.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {producto.imagen_principal && (
                                            <button
                                                onClick={() => setImagenSeleccionada(producto.imagen_principal)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                    imagenSeleccionada === producto.imagen_principal 
                                                        ? 'border-amber-500' 
                                                        : 'border-gray-200 hover:border-amber-300'
                                                }`}
                                            >
                                                <img src={producto.imagen_principal} alt={producto.nombre} className="w-full h-full object-cover" />
                                            </button>
                                        )}
                                        {producto.galeria_imagenes.map((imagen, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setImagenSeleccionada(imagen)}
                                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                                    imagenSeleccionada === imagen 
                                                        ? 'border-amber-500' 
                                                        : 'border-gray-200 hover:border-amber-300'
                                                }`}
                                            >
                                                <img src={imagen} alt={`${producto.nombre} ${index + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                                            {producto.categoria_producto?.nombre}
                                        </span>
                                        <div className="flex items-center">
                                            {renderizarEstrellas(Math.round(estadisticasComentarios.promedio_calificacion))}
                                            <span className="ml-2 text-gray-600 text-sm">
                                                ({estadisticasComentarios.total_comentarios} {estadisticasComentarios.total_comentarios === 1 ? 'reseña' : 'reseñas'})
                                            </span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
                                </div>

                                <div className="text-4xl font-bold text-amber-600">
                                    ${parseFloat(producto.precio).toFixed(2)}
                                </div>

                                {producto.descripcion && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                                        <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
                                    </div>
                                )}

                                {/* Información de stock */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-green-800 font-medium">
                                            {producto.stock > 10 ? 'Disponible' : `Solo ${producto.stock} unidades disponibles`}
                                        </span>
                                    </div>
                                </div>

                                {/* Selector de cantidad y botón de compra */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={decrementarCantidad}
                                                disabled={cantidad <= 1}
                                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-16 text-center text-xl font-semibold">{cantidad}</span>
                                            <button
                                                onClick={incrementarCantidad}
                                                disabled={cantidad >= producto.stock}
                                                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={agregarAlCarrito}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                                    >
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"></path>
                                        </svg>
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Video del producto (si existe) */}
                        {producto.video_url && (
                            <div className="px-8 pb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Video del Producto</h3>
                                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe
                                        src={producto.video_url}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={`Video de ${producto.nombre}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de comentarios y calificaciones */}
                    <div className="bg-white shadow-xl rounded-2xl border border-amber-200 p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Reseñas y Comentarios</h3>
                            {puedeComentarInfo.puede_comentar && (
                                <button
                                    onClick={() => setMostrarFormularioComentario(!mostrarFormularioComentario)}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold"
                                >
                                    {mostrarFormularioComentario ? 'Cancelar' : 'Escribir Reseña'}
                                </button>
                            )}
                        </div>

                        {/* Estadísticas de calificaciones */}
                        {estadisticasComentarios.total_comentarios > 0 && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-amber-600 mb-2">
                                            {estadisticasComentarios.promedio_calificacion}
                                        </div>
                                        <div className="flex justify-center mb-2">
                                            {renderizarEstrellas(Math.round(estadisticasComentarios.promedio_calificacion), 'w-6 h-6')}
                                        </div>
                                        <p className="text-gray-600">
                                            Basado en {estadisticasComentarios.total_comentarios} {estadisticasComentarios.total_comentarios === 1 ? 'reseña' : 'reseñas'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((estrellas) => (
                                            <div key={estrellas} className="flex items-center">
                                                <span className="text-sm font-medium text-gray-700 w-3">{estrellas}</span>
                                                <svg className="w-4 h-4 text-amber-400 fill-current mx-1" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <div className="flex-1 mx-2">
                                                    <div className="bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${estadisticasComentarios.distribucion_calificaciones[estrellas]?.percentage || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-600 w-8">
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
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Escribe tu reseña</h4>
                                
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Selecciona el pedido
                                        </label>
                                        <select
                                            value={nuevoComentario.pedido_id}
                                            onChange={(e) => setNuevoComentario({...nuevoComentario, pedido_id: e.target.value})}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Calificación
                                        </label>
                                        <div className="flex items-center space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setNuevoComentario({...nuevoComentario, calificacion: star})}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tu comentario (opcional)
                                    </label>
                                    <textarea
                                        value={nuevoComentario.comentario}
                                        onChange={(e) => setNuevoComentario({...nuevoComentario, comentario: e.target.value})}
                                        placeholder="Comparte tu experiencia con este producto..."
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        maxLength="1000"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {nuevoComentario.comentario.length}/1000 caracteres
                                    </p>
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={enviarComentario}
                                        disabled={enviandoComentario || !nuevoComentario.pedido_id}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {enviandoComentario ? 'Enviando...' : 'Publicar Reseña'}
                                    </button>
                                    <button
                                        onClick={() => setMostrarFormularioComentario(false)}
                                        className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
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
                                    <div key={comentario.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {comentario.user?.avatar_url ? (
                                                    <img 
                                                        src={comentario.user.avatar_url} 
                                                        alt={comentario.user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
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
                                                    <p className="text-gray-700 mt-2">{comentario.comentario}</p>
                                                )}
                                                <p className="text-gray-500 text-sm mt-1">
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
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-gray-500">Aún no hay reseñas para este producto.</p>
                                <p className="text-gray-400 text-sm mt-1">¡Sé el primero en dejar una reseña!</p>
                            </div>
                        )}
                    </div>

                    {/* Productos relacionados */}
                    {productosRelacionados && productosRelacionados.length > 0 && (
                        <div className="bg-white shadow-xl rounded-2xl border border-amber-200 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {productosRelacionados.map((productoRelacionado) => (
                                    <Link
                                        key={productoRelacionado.id}
                                        href={route('clientes.producto.show', productoRelacionado.id)}
                                        className="group"
                                    >
                                        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                                            <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                {productoRelacionado.imagen_url ? (
                                                    <img 
                                                        src={productoRelacionado.imagen_url} 
                                                        alt={productoRelacionado.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                                                    {productoRelacionado.nombre}
                                                </h4>
                                                <div className="text-lg font-bold text-amber-600 mt-2">
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
        </AuthenticatedLayout>
    );
}