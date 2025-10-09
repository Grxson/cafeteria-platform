import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircleIcon, ClockIcon, XCircleIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatNumber } from '@/Utils/formatUtils';
import InvoiceSentModal from '@/Components/Modals/InvoiceSentModal';
import { useState, useEffect } from 'react';

export default function Pedidos({ cliente, pedidos, invoice_sent }) {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    useEffect(() => {
        if (invoice_sent) {
            setShowInvoiceModal(true);
        }
    }, [invoice_sent]);

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'completado':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelado':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case 'completado':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'pendiente':
                return <ClockIcon className="w-5 h-5" />;
            case 'cancelado':
                return <XCircleIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-amber-800">
                        Mis Pedidos
                    </h2>
                    <Link
                        href={route('clientes.tienda')}
                        className="px-4 py-2 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                        Seguir Comprando
                    </Link>
                </div>
            }
        >
            <Head title="Mis Pedidos - CafeTech" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {pedidos && pedidos.length > 0 ? (
                        <div className="space-y-6">
                            {pedidos.map((pedido) => (
                                <div key={pedido.id} className="bg-white border shadow-xl rounded-2xl border-amber-200 overflow-hidden">
                                    {/* Header del pedido */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Pedido #{pedido.id}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {pedido.fecha}
                                                </p>
                                                {pedido.id_transaccion_pago && (
                                                    <p className="text-xs text-gray-500">
                                                        ID Transacción: {pedido.id_transaccion_pago}
                                                    </p>
                                                )}
                                                {pedido.direccion_envio && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        📍 {pedido.direccion_envio}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(pedido.estado)}`}>
                                                    {getEstadoIcon(pedido.estado)}
                                                    <span className="ml-2 capitalize">{pedido.estado}</span>
                                                </span>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-amber-600">
                                                        {formatCurrency(pedido.total)}
                                                    </p>
                                                    {pedido.estado === 'completado' && (
                                                        <div className="flex gap-2 mt-2">
                                                            <a
                                                                href={route('clientes.factura.view', pedido.id)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                                                            >
                                                                <EyeIcon className="w-3 h-3 mr-1" />
                                                                Ver
                                                            </a>
                                                            <a
                                                                href={route('clientes.factura.download', pedido.id)}
                                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
                                                            >
                                                                <DocumentArrowDownIcon className="w-3 h-3 mr-1" />
                                                                PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos del pedido */}
                                    <div className="p-6">
                                        <h4 className="mb-4 text-base font-semibold text-gray-900">Productos</h4>
                                        <div className="space-y-3">
                                            {pedido.productos.map((producto, index) => (
                                                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900">{producto.nombre}</h5>
                                                        <p className="text-sm text-gray-600">
                                                            Cantidad: {producto.cantidad} × {formatCurrency(producto.precio_unitario)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {formatCurrency(producto.subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border shadow-xl rounded-2xl border-amber-200 p-8 text-center">
                            <div className="mb-6">
                                <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No tienes pedidos aún
                            </h3>
                            <p className="text-gray-600 mb-6">
                                ¡Explora nuestra tienda y realiza tu primera compra!
                            </p>
                            <Link
                                href={route('clientes.tienda')}
                                className="inline-flex items-center px-6 py-3 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Ir a la Tienda
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de factura enviada */}
            <InvoiceSentModal 
                isOpen={showInvoiceModal} 
                onClose={() => setShowInvoiceModal(false)} 
            />
        </AuthenticatedLayout>
    );
}
