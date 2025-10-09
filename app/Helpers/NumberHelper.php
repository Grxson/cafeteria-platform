<?php

namespace App\Helpers;

class NumberHelper
{
    /**
     * Formatea un número con comas para separar miles y punto para decimales
     *
     * @param float|int|string $number
     * @param int $decimals
     * @return string
     */
    public static function formatNumber($number, int $decimals = 2): string
    {
        if ($number === null || $number === '') {
            return '0.00';
        }

        $num = (float) $number;
        
        return number_format($num, $decimals, '.', ',');
    }

    /**
     * Formatea un número como moneda mexicana
     *
     * @param float|int|string $amount
     * @param string $currency
     * @return string
     */
    public static function formatCurrency($amount, string $currency = 'MXN'): string
    {
        if ($amount === null || $amount === '') {
            return '$0.00 MXN';
        }

        $num = (float) $amount;
        $formatted = number_format($num, 2, '.', ',');
        
        return '$' . $formatted . ' ' . $currency;
    }

    /**
     * Formatea un número sin decimales (para cantidades)
     *
     * @param float|int|string $number
     * @return string
     */
    public static function formatInteger($number): string
    {
        if ($number === null || $number === '') {
            return '0';
        }

        $num = (int) $number;
        
        return number_format($num, 0, '.', ',');
    }

    /**
     * Formatea un número de teléfono mexicano
     *
     * @param string $phone
     * @return string
     */
    public static function formatPhone(string $phone): string
    {
        if (empty($phone)) {
            return '';
        }

        // Remover todos los caracteres no numéricos
        $cleaned = preg_replace('/\D/', '', $phone);
        
        // Si empieza con 52 (código de país), lo removemos
        $withoutCountryCode = str_starts_with($cleaned, '52') ? substr($cleaned, 2) : $cleaned;
        
        // Formatear según la longitud
        if (strlen($withoutCountryCode) === 10) {
            return '+52 ' . substr($withoutCountryCode, 0, 2) . ' ' . 
                   substr($withoutCountryCode, 2, 4) . ' ' . 
                   substr($withoutCountryCode, 6);
        } elseif (strlen($withoutCountryCode) === 8) {
            return '+52 55 ' . substr($withoutCountryCode, 0, 4) . ' ' . 
                   substr($withoutCountryCode, 4);
        }
        
        return $phone; // Devolver original si no coincide con formatos conocidos
    }

    /**
     * Formatea una dirección de envío completa
     *
     * @param array $direccion
     * @return string
     */
    public static function formatDireccionEnvio(array $direccion): string
    {
        $partes = [];
        
        if (!empty($direccion['calle']) && !empty($direccion['numero'])) {
            $partes[] = trim($direccion['calle'] . ' ' . $direccion['numero']);
        }
        
        if (!empty($direccion['colonia'])) {
            $partes[] = $direccion['colonia'];
        }
        
        if (!empty($direccion['ciudad'])) {
            $partes[] = $direccion['ciudad'];
        }
        
        if (!empty($direccion['estado']) && !empty($direccion['codigo_postal'])) {
            $partes[] = $direccion['estado'] . ' ' . $direccion['codigo_postal'];
        } elseif (!empty($direccion['estado'])) {
            $partes[] = $direccion['estado'];
        }
        
        $direccionCompleta = implode(', ', $partes);
        
        if (!empty($direccion['telefono'])) {
            $direccionCompleta .= ' (Tel: ' . self::formatPhone($direccion['telefono']) . ')';
        }
        
        return $direccionCompleta;
    }
}
