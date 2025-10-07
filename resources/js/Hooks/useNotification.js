import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export const useNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const { props } = usePage();

    useEffect(() => {
        // Verificar si hay una notificación en las props de la página
        if (props.notification) {
            addNotification(props.notification);
        }
        
        // También verificar el flash message success
        if (props.flash?.success && !props.notification) {
            addNotification({
                type: 'success',
                message: props.flash.success,
                duration: 4000
            });
        }

        // También verificar errores
        if (props.errors && Object.keys(props.errors).length > 0) {
            const errorMessage = Object.values(props.errors)[0];
            addNotification({
                type: 'error',
                message: errorMessage,
                duration: 6000
            });
        }
    }, [props.notification, props.flash, props.errors]);

    const addNotification = (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: notification.type || 'info',
            message: notification.message,
            duration: notification.duration || 4000
        };

        setNotifications(prev => [...prev, newNotification]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return {
        notifications,
        addNotification,
        removeNotification
    };
};