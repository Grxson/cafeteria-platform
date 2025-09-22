<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\CategoriaProducto;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener las categorías actualizadas
        $cafeGrano = CategoriaProducto::where('nombre', 'Café en Grano')->first();
        $cafeMolido = CategoriaProducto::where('nombre', 'Café Molido')->first();
        $capsulas = CategoriaProducto::where('nombre', 'Cápsulas y Pods')->first();
        $instantaneo = CategoriaProducto::where('nombre', 'Café Instantáneo')->first();
        $accesorios = CategoriaProducto::where('nombre', 'Accesorios')->first();
        $equipos = CategoriaProducto::where('nombre', 'Equipos')->first();
        $especial = CategoriaProducto::where('nombre', 'Café Especial')->first();
        $dulces = CategoriaProducto::where('nombre', 'Dulces y Acompañantes')->first();

        $productos = [
            // Café en Grano
            [
                'nombre' => 'Café Arábica Premium Colombia',
                'descripcion' => 'Granos de café arábica 100% colombiano, tostado medio. Notas a chocolate y caramelo con acidez equilibrada.',
                'precio' => 320.00,
                'stock' => 50,
                'categoria_producto_id' => $cafeGrano->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800',
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0d9?w=800'
                ],
                'video_url' => 'https://www.youtube.com/embed/O_uBzZWE86M',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café Robusta Brasileño',
                'descripcion' => 'Granos robusta de Brasil, tostado oscuro. Intenso y con cuerpo, ideal para espresso y café fuerte.',
                'precio' => 280.00,
                'stock' => 40,
                'categoria_producto_id' => $cafeGrano->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800'
                ],
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Blend Etíope de Altura',
                'descripcion' => 'Mezcla exclusiva de granos etíopes cultivados a gran altura. Notas florales y frutales únicas.',
                'precio' => 450.00,
                'stock' => 30,
                'categoria_producto_id' => $cafeGrano->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800',
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0d9?w=800'
                ],
                'estado' => 'activo',
            ],

            // Café Molido
            [
                'nombre' => 'Café Molido Americano Clásico',
                'descripcion' => 'Café molido medio, perfecto para cafeteras de filtro y prensa francesa. Sabor balanceado y aromático.',
                'precio' => 180.00,
                'stock' => 75,
                'categoria_producto_id' => $cafeMolido->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800',
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0d9?w=800'
                ],
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Espresso Molido Italiano',
                'descripcion' => 'Molienda fina especial para máquinas de espresso. Mezcla italiana tradicional, tostado oscuro.',
                'precio' => 220.00,
                'stock' => 60,
                'categoria_producto_id' => $cafeMolido->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café Descafeinado Molido',
                'descripcion' => 'Café descafeinado mediante proceso natural, conserva todo el sabor sin la cafeína.',
                'precio' => 195.00,
                'stock' => 45,
                'categoria_producto_id' => $cafeMolido->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400',
                'estado' => 'activo',
            ],

            // Cápsulas y Pods
            [
                'nombre' => 'Cápsulas Nespresso Compatible - Intenso',
                'descripcion' => 'Pack de 50 cápsulas compatibles con máquinas Nespresso. Intensidad 8, sabor robusto.',
                'precio' => 350.00,
                'stock' => 100,
                'categoria_producto_id' => $capsulas->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1569934811356-5cc061b6821f?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1569934811356-5cc061b6821f?w=800'
                ],
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Pods Dolce Gusto - Cappuccino',
                'descripcion' => 'Pack de 32 cápsulas Dolce Gusto para preparar cappuccino cremoso en casa.',
                'precio' => 280.00,
                'stock' => 80,
                'categoria_producto_id' => $capsulas->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1569934811356-5cc061b6821f?w=400',
                'estado' => 'activo',
            ],

            // Café Instantáneo
            [
                'nombre' => 'Café Instantáneo Premium',
                'descripcion' => 'Café soluble de alta calidad, liofilizado para conservar aroma y sabor. Fácil preparación.',
                'precio' => 125.00,
                'stock' => 120,
                'categoria_producto_id' => $instantaneo->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Café 3 en 1 Cremoso',
                'descripcion' => 'Café instantáneo con azúcar y crema. Pack de 24 sobres individuales, listo para disfrutar.',
                'precio' => 95.00,
                'stock' => 150,
                'categoria_producto_id' => $instantaneo->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                'estado' => 'activo',
            ],

            // Accesorios
            [
                'nombre' => 'Taza de Cerámica Artesanal',
                'descripcion' => 'Taza de cerámica hecha a mano, capacidad 350ml. Perfecta para disfrutar tu café favorito.',
                'precio' => 85.00,
                'stock' => 200,
                'categoria_producto_id' => $accesorios->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800',
                    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'
                ],
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Molinillo de Café Manual',
                'descripcion' => 'Molinillo de café manual con fresas de cerámica. Ajuste de molienda variable.',
                'precio' => 450.00,
                'stock' => 25,
                'categoria_producto_id' => $accesorios->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559305616-f42c2ead8b70?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1559305616-f42c2ead8b70?w=800'
                ],
                'video_url' => 'https://www.youtube.com/embed/rlCGFTtZdqI',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Filtros de Papel V60',
                'descripcion' => 'Pack de 100 filtros de papel para método V60. Grosor óptimo para extracción perfecta.',
                'precio' => 75.00,
                'stock' => 300,
                'categoria_producto_id' => $accesorios->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559305616-f42c2ead8b70?w=400',
                'estado' => 'activo',
            ],

            // Equipos
            [
                'nombre' => 'Cafetera Prensa Francesa 1L',
                'descripcion' => 'Cafetera de prensa francesa de vidrio borosilicato con filtro de acero inoxidable.',
                'precio' => 320.00,
                'stock' => 35,
                'categoria_producto_id' => $equipos->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1545665277-5937750adf65?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1545665277-5937750adf65?w=800'
                ],
                'video_url' => 'https://www.youtube.com/embed/st571DYYTR8',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Cafetera Italiana Moka 6 Tazas',
                'descripcion' => 'Clásica cafetera italiana Moka de aluminio. Capacidad para 6 tazas de espresso.',
                'precio' => 180.00,
                'stock' => 50,
                'categoria_producto_id' => $equipos->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1545665277-5937750adf65?w=400',
                'estado' => 'activo',
            ],

            // Café Especial
            [
                'nombre' => 'Café Geisha Panamá - Edición Limitada',
                'descripcion' => 'Café Geisha de Panamá, uno de los más exclusivos del mundo. Notas florales y té verde.',
                'precio' => 1200.00,
                'stock' => 10,
                'categoria_producto_id' => $especial->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
                'galeria_imagenes' => [
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800',
                    'https://images.unsplash.com/photo-1587734195503-904fca47e0d9?w=800'
                ],
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Blend Orgánico Certificado',
                'descripcion' => 'Mezcla de cafés orgánicos certificados de comercio justo. Cultivo sostenible y ético.',
                'precio' => 380.00,
                'stock' => 40,
                'categoria_producto_id' => $especial->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400',
                'estado' => 'activo',
            ],

            // Dulces y Acompañantes
            [
                'nombre' => 'Azúcar Morena de Caña',
                'descripcion' => 'Azúcar morena natural de caña. Pack de 500g, ideal para endulzar tu café.',
                'precio' => 45.00,
                'stock' => 250,
                'categoria_producto_id' => $dulces->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Sirope de Vainilla Premium',
                'descripcion' => 'Sirope de vainilla natural para aromatizar café. Botella de 250ml con dosificador.',
                'precio' => 125.00,
                'stock' => 100,
                'categoria_producto_id' => $dulces->id,
                'imagen_principal' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
                'estado' => 'activo',
            ],
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }

        $this->command->info('ProductSeeder completado: 22 productos de café físico creados con galerías e videos en 8 categorías');
    }
}
