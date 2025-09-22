/**
 * Utility function to get the correct avatar URL
 * Handles both external URLs (like ui-avatars.com) and local storage paths
 * 
 * @param {string|null} avatarUrl - The avatar URL from the database
 * @returns {string|null} - The properly formatted URL for display
 */
export const getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    
    // If it's an external URL (starts with http/https), return as-is
    if (avatarUrl.startsWith('http')) {
        return avatarUrl;
    }
    
    // If it's a local path, prepend /storage/
    return `/storage/${avatarUrl}`;
};

/**
 * Utility function to get the correct product image URL
 * Handles both external URLs (like unsplash.com) and local storage paths
 * 
 * @param {string|null} imageUrl - The image URL from the database
 * @returns {string|null} - The properly formatted URL for display
 */
export const getImagenUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's an external URL (starts with http/https), return as-is
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If it's a local path, prepend /storage/
    return `/storage/${imageUrl}`;
};

/**
 * Generate a default avatar URL using ui-avatars.com
 * 
 * @param {string} name - The user's name
 * @param {string} [background='6b7280'] - Background color hex (without #)
 * @param {string} [color='fff'] - Text color hex (without #)
 * @returns {string} - The generated avatar URL
 */
export const generateDefaultAvatar = (name, background = '6b7280', color = 'fff') => {
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}`;
};