import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    CheckCircleIcon, 
    MapPinIcon, 
    UserIcon, 
    CreditCardIcon,
    ArrowLeftIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatNumber, formatPhone } from '@/Utils/formatUtils';

export default function CheckoutPreview({ carrito, cliente, producto, cantidad, total, total_formatted, esCompraDirecta }) {
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [direccionEnvio, setDireccionEnvio] = useState({
        calle: '',
        numero: '',
        colonia: '',
        ciudad: '',
        codigo_postal: '',
        estado: '',
        telefono: ''
    });

    const procederAlPago = async () => {
        // Validar que hay productos para procesar
        if (!esCompraDirecta && (!carrito?.productos || carrito.productos.length === 0)) {
            return;
        }

        if (esCompraDirecta && !producto) {
            return;
        }

        // Validar dirección de envío
        if (!direccionEnvio.calle || !direccionEnvio.numero || !direccionEnvio.colonia || 
            !direccionEnvio.ciudad || !direccionEnvio.codigo_postal || !direccionEnvio.estado || 
            !direccionEnvio.telefono) {
            alert('Por favor completa todos los campos de la dirección de envío');
            return;
        }

        setProcesandoPago(true);

        try {
            let routeName, requestBody;

            if (esCompraDirecta) {
                // Compra directa
                routeName = 'clientes.stripe.checkout.direct';
                requestBody = {
                    producto_id: producto.id,
                    cantidad: cantidad,
                    direccion_envio: direccionEnvio
                };
            } else {
                // Compra del carrito
                routeName = 'clientes.stripe.checkout';
                requestBody = {
                    direccion_envio: direccionEnvio
                };
            }

            const response = await fetch(route(routeName), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Redirigir a Stripe Checkout
                window.location.href = data.checkout_url;
            } else {
                alert(data.message || 'Error al procesar el pago');
                setProcesandoPago(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
            setProcesandoPago(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-amber-800">
                        Confirmar Pedido
                    </h2>
                    <button
                        onClick={() => router.visit(route('clientes.carrito'))}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Volver al Carrito
                    </button>
                </div>
            }
        >
            <Head title="Confirmar Pedido - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Información del Cliente y Dirección */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Datos del Cliente */}
                            <div className="bg-white border shadow-lg rounded-2xl border-amber-200">
                                <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                            <UserIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-amber-800">
                                            Datos del Cliente
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <p className="mt-1 text-sm text-gray-900">{cliente.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <p className="mt-1 text-sm text-gray-900">{cliente.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de Envío */}
                            <div className="bg-white border shadow-lg rounded-2xl border-amber-200">
                                <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                            <MapPinIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-amber-800">
                                            Dirección de Envío
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Calle</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.calle}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, calle: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="Nombre de la calle"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Número</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.numero}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, numero: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="123"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Colonia</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.colonia}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, colonia: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="Nombre de la colonia"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.ciudad}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, ciudad: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="Ciudad"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.codigo_postal}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, codigo_postal: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="12345"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                                            <input
                                                type="text"
                                                value={direccionEnvio.estado}
                                                onChange={(e) => setDireccionEnvio({...direccionEnvio, estado: e.target.value})}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="Estado"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
                                            <input
                                                type="tel"
                                                value={direccionEnvio.telefono}
                                                onChange={(e) => {
                                                    const formatted = formatPhone(e.target.value);
                                                    setDireccionEnvio({...direccionEnvio, telefono: e.target.value});
                                                }}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                placeholder="+52 55 1234 5678"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Productos del Pedido */}
                            <div className="bg-white border shadow-lg rounded-2xl border-amber-200">
                                <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                            <TruckIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-amber-800">
                                            Productos a Enviar
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {esCompraDirecta ? (
                                            // Producto individual para compra directa
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                <img
                                                    src={producto.imagen_principal || '/images/placeholder-product.jpg'}
                                                    alt={producto.nombre}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
                                                    <p className="text-sm text-gray-600">Cantidad: {cantidad}</p>
                                                    <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(producto.precio)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-amber-600">
                                                        {formatCurrency(total)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            // Productos del carrito
                                            (carrito?.productos || []).map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                    <img
                                                        src={item.producto.imagen_principal || '/images/placeholder-product.jpg'}
                                                        alt={item.producto.nombre}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{item.producto.nombre}</h4>
                                                        <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                                                        <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(item.precio_unitario)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-amber-600">
                                                            {formatCurrency(item.subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen del Pedido */}
                        <div className="lg:col-span-1">
                            <div className="sticky overflow-hidden bg-white border shadow-lg rounded-2xl border-amber-200 top-6">
                                <div className="px-6 py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500">
                                            <CreditCardIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-amber-800">
                                            Resumen del Pedido
                                        </h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Desglose de productos */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-gray-700">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                Productos ({esCompraDirecta ? cantidad : (carrito?.cantidad_productos || 0)} {esCompraDirecta ? (cantidad === 1 ? 'item' : 'items') : 'items'})
                                            </span>
                                            <span className="font-semibold">{formatCurrency(esCompraDirecta ? total : (carrito?.total || 0))}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-gray-700">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                Envío
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold text-green-600">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                Gratis
                                            </span>
                                        </div>
                                    </div>

                                    <hr className="border-amber-200" />

                                    {/* Total destacado */}
                                    <div className="p-4 border bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-amber-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-800">Total a pagar</span>
                                            <span className="text-2xl font-bold text-amber-700">
                                                {formatCurrency(esCompraDirecta ? total : (carrito?.total || 0))}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">IVA incluido</p>
                                    </div>

                                    {/* Botón de pago */}
                                    <button
                                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        onClick={procederAlPago}
                                        disabled={procesandoPago || (!esCompraDirecta && (!carrito?.productos || carrito.productos.length === 0)) || (esCompraDirecta && !producto)}
                                    >
                                        {procesandoPago ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Proceder al Pago
                                            </>
                                        )}
                                    </button>

                                    {/* Información de seguridad */}
                                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="mb-1 text-sm font-semibold text-blue-800">Pago Seguro</h4>
                                                <p className="text-xs text-blue-700">
                                                    Tus datos están protegidos con encriptación SSL. 
                                                    Procesamos pagos de forma segura con Stripe.
                                                </p>
                                            </div>
                                        </div>
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
