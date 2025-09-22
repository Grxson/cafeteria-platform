import { useState } from 'react';

export const useConfirmation = () => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        onConfirm: null,
        icon: null
    });

    const showConfirmation = ({
        title,
        message,
        type = 'warning',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        onConfirm,
        icon = null
    }) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText,
                onConfirm: () => {
                    if (onConfirm) onConfirm();
                    resolve(true);
                },
                icon
            });
        });
    };

    const showAlert = ({
        title,
        message,
        type = 'info',
        confirmText = 'Entendido',
        icon = null
    }) => {
        return new Promise((resolve) => {
            setModalState({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText: '',
                onConfirm: () => resolve(true),
                icon
            });
        });
    };

    const hideModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    // Funciones específicas para la cafetería
    const confirmDeleteProduct = (productName) => {
        return showConfirmation({
            title: '¿Eliminar producto del carrito?',
            message: `¿Estás seguro de que deseas eliminar "${productName}" de tu carrito? Esta acción no se puede deshacer.`,
            type: 'warning',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar'
        });
    };

    const confirmClearCart = () => {
        return showConfirmation({
            title: '¿Vaciar todo el carrito?',
            message: 'Se eliminarán todos los productos de tu carrito. Esta acción no se puede deshacer.',
            type: 'warning',
            confirmText: 'Sí, vaciar carrito',
            cancelText: 'Cancelar'
        });
    };

    const showSuccess = (message, title = '¡Perfecto!') => {
        return showAlert({
            title,
            message,
            type: 'success',
            confirmText: '¡Genial!'
        });
    };

    const showError = (message, title = 'Algo salió mal') => {
        return showAlert({
            title,
            message,
            type: 'error',
            confirmText: 'Entendido'
        });
    };

    const showInfo = (message, title = 'Información') => {
        return showAlert({
            title,
            message,
            type: 'info',
            confirmText: 'Entendido'
        });
    };

    return {
        modalState,
        hideModal,
        showConfirmation,
        showAlert,
        showSuccess,
        showError,
        showInfo,
        confirmDeleteProduct,
        confirmClearCart
    };
};