import { useState } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProductImage({ 
    src, 
    alt, 
    className = "h-10 w-10 rounded-lg object-cover",
    fallbackIcon: FallbackIcon = ShoppingBagIcon,
    fallbackClassName = "h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center"
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleLoad = () => {
        setImageLoading(false);
    };

    // Si hay error o no hay src, mostrar fallback
    if (imageError || !src) {
        return (
            <div className={fallbackClassName}>
                <FallbackIcon className="w-5 h-5 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="relative">
            {imageLoading && (
                <div className={`${fallbackClassName} absolute inset-0`}>
                    <div className="animate-pulse bg-gray-300 rounded-lg w-full h-full"></div>
                </div>
            )}
            <img
                className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                src={src.startsWith('http') ? src : `/storage/${src}`}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                loading="lazy"
            />
        </div>
    );
}
