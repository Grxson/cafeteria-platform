/**
 * Utilidades para formatear números y monedas
 */

/**
 * Formatea un número con comas para separar miles y punto para decimales
 * @param {number|string} number - El número a formatear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} - Número formateado
 */
export function formatNumber(number, decimals = 2) {
    if (number === null || number === undefined || number === '') {
        return '0.00';
    }
    
    const num = parseFloat(number);
    if (isNaN(num)) {
        return '0.00';
    }
    
    return num.toLocaleString('es-MX', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Formatea un número como moneda mexicana
 * @param {number|string} amount - La cantidad a formatear
 * @param {string} currency - La moneda (por defecto 'MXN')
 * @returns {string} - Cantidad formateada como moneda
 */
export function formatCurrency(amount, currency = 'MXN') {
    if (amount === null || amount === undefined || amount === '') {
        return '$0.00 MXN';
    }
    
    const num = parseFloat(amount);
    if (isNaN(num)) {
        return '$0.00 MXN';
    }
    
    return num.toLocaleString('es-MX', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Formatea un número sin decimales (para cantidades)
 * @param {number|string} number - El número a formatear
 * @returns {string} - Número formateado sin decimales
 */
export function formatInteger(number) {
    if (number === null || number === undefined || number === '') {
        return '0';
    }
    
    const num = parseInt(number);
    if (isNaN(num)) {
        return '0';
    }
    
    return num.toLocaleString('es-MX');
}

/**
 * Formatea un número de teléfono mexicano
 * @param {string} phone - El número de teléfono
 * @returns {string} - Teléfono formateado
 */
export function formatPhone(phone) {
    if (!phone) return '';
    
    // Remover todos los caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Si empieza con 52 (código de país), lo removemos
    const withoutCountryCode = cleaned.startsWith('52') ? cleaned.slice(2) : cleaned;
    
    // Formatear según la longitud
    if (withoutCountryCode.length === 10) {
        return `+52 ${withoutCountryCode.slice(0, 2)} ${withoutCountryCode.slice(2, 6)} ${withoutCountryCode.slice(6)}`;
    } else if (withoutCountryCode.length === 8) {
        return `+52 55 ${withoutCountryCode.slice(0, 4)} ${withoutCountryCode.slice(4)}`;
    }
    
    return phone; // Devolver original si no coincide con formatos conocidos
}
