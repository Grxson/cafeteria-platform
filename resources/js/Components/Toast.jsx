import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const Toast = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (notification?.duration) {
            const timer = setTimeout(() => {
                closeToast();
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const closeToast = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!isVisible || !notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />;
            case 'info':
            default:
                return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBgColor = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
            isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}>
            <div className={`max-w-sm w-full ${getBgColor()} border rounded-lg shadow-lg p-4`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {getIcon()}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={closeToast}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Cerrar</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Toast;
