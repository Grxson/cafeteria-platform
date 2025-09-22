import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    icon: CustomIcon
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const typeStyles = {
        warning: {
            icon: ExclamationTriangleIcon,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-100',
            confirmBg: 'bg-amber-600 hover:bg-amber-700',
            titleColor: 'text-amber-800'
        },
        error: {
            icon: XCircleIcon,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            confirmBg: 'bg-red-600 hover:bg-red-700',
            titleColor: 'text-red-800'
        },
        success: {
            icon: CheckCircleIcon,
            iconColor: 'text-green-600',
            iconBg: 'bg-green-100',
            confirmBg: 'bg-green-600 hover:bg-green-700',
            titleColor: 'text-green-800'
        },
        info: {
            icon: InformationCircleIcon,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            confirmBg: 'bg-blue-600 hover:bg-blue-700',
            titleColor: 'text-blue-800'
        }
    };

    const config = typeStyles[type];
    const IconComponent = CustomIcon || config.icon;

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return isOpen ? createPortal(
        <div className="fixed inset-0 z-[999999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={handleCancel}
            />

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className={`inline-block overflow-hidden text-left align-bottom transition-all duration-300 transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[999999] ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                >
                    {/* Header con icono */}
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 w-12 h-12 mx-auto rounded-full ${config.iconBg} flex items-center justify-center`}>
                                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                            </div>
                            <button
                                onClick={handleCancel}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="px-6 pb-6">
                        <div className="text-center">
                            <h3 className={`text-xl font-bold ${config.titleColor} mb-3`}>
                                {title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {message}
                            </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
                            <button
                                onClick={handleCancel}
                                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                                {cancelText}
                            </button>
                            {onConfirm && (
                                <button
                                    onClick={handleConfirm}
                                    className={`w-full sm:w-auto px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${config.confirmBg}`}
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Decoración inferior */}
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-b-2xl"></div>
                </div>
            </div>
        </div>,
        document.body
    ) : null;
};

export default ConfirmationModal;
