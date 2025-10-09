import { useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function InvoiceSentModal({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            // Auto cerrar el modal después de 5 segundos
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose}></div>
                
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all z-[10000]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                ¡Factura Enviada!
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100">
                                <EnvelopeIcon className="w-8 h-8 text-blue-600" />
                            </div>
                            
                            <h4 className="text-xl font-bold text-gray-900 mb-3">
                                Correo Electrónico Enviado
                            </h4>
                            
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Se ha enviado un correo electrónico con la <strong>factura y detalles</strong> de tu pedido a tu dirección de email registrada.
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-blue-800">
                                            ¿No recibiste el correo?
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Revisa tu carpeta de spam o contacta con soporte si no aparece en unos minutos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Entendido
                                </button>
                                <a
                                    href={route('clientes.pedidos')}
                                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                                >
                                    Ver Pedidos
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Este modal se cerrará automáticamente en unos segundos</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
