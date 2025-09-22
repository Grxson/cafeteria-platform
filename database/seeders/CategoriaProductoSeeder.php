<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CategoriaProducto;

class CategoriaProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Café en Grano',
                'descripcion' => 'Café en grano entero de diferentes orígenes, tostados y perfiles de sabor',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café Molido',
                'descripcion' => 'Café molido listo para preparar, diferentes grados de molienda',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Cápsulas y Pods',
                'descripcion' => 'Cápsulas compatibles con diferentes máquinas de café',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café Instantáneo',
                'descripcion' => 'Café soluble de alta calidad, fácil y rápido de preparar',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Accesorios',
                'descripcion' => 'Tazas, molinillos, filtros y accesorios para café',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Equipos',
                'descripcion' => 'Máquinas de café, cafeteras y equipos de preparación',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café Especial',
                'descripcion' => 'Blends especiales, café orgánico y ediciones limitadas',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Dulces y Acompañantes',
                'descripcion' => 'Azúcar, endulzantes, siropes y complementos para café',
                'estado' => 'activo',
            ],
        ];

        foreach ($categorias as $categoria) {
            CategoriaProducto::create($categoria);
        }

        $this->command->info('CategoriaProductoSeeder completado: 6 categorías creadas');
    }
}
