<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuario SuperAdmin
        User::create([
            'name' => 'Super Administrador',
            'email' => 'superadmin@cafeteria.com',
            'password' => Hash::make('password'),
            'telefono' => '+1234567890',
            'direccion' => 'Oficina Central, Ciudad',
            'estado' => 'activo',
            'rol' => 'superadmin',
            'metodo_autenticacion' => 'email',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Super+Admin&background=f59e0b&color=fff',
        ]);

        // Usuario Editor
        User::create([
            'name' => 'Editor Principal',
            'email' => 'editor@cafeteria.com',
            'password' => Hash::make('password'),
            'telefono' => '+1234567891',
            'direccion' => 'Sucursal Norte, Ciudad',
            'estado' => 'activo',
            'rol' => 'editor',
            'metodo_autenticacion' => 'email',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Editor&background=ea580c&color=fff',
        ]);

        // Usuario Gestor
        User::create([
            'name' => 'Gestor de Inventario',
            'email' => 'gestor@cafeteria.com',
            'password' => Hash::make('password'),
            'telefono' => '+1234567892',
            'direccion' => 'Almacén Central, Ciudad',
            'estado' => 'activo',
            'rol' => 'gestor',
            'metodo_autenticacion' => 'email',
            'avatar_url' => 'https://ui-avatars.com/api/?name=Gestor&background=dc2626&color=fff',
        ]);

        // Usuarios Clientes (15 usuarios)
        $clientes = [
            ['name' => 'Ana García', 'email' => 'ana.garcia@email.com', 'telefono' => '+1234567893', 'direccion' => 'Av. Principal 123, Colonia Centro'],
            ['name' => 'Carlos Mendoza', 'email' => 'carlos.mendoza@email.com', 'telefono' => '+1234567894', 'direccion' => 'Calle Secundaria 456, Colonia Norte'],
            ['name' => 'María López', 'email' => 'maria.lopez@email.com', 'telefono' => '+1234567895', 'direccion' => 'Boulevard Sur 789, Colonia Sur'],
            ['name' => 'Juan Pérez', 'email' => 'juan.perez@email.com', 'telefono' => '+1234567896', 'direccion' => 'Av. Libertad 321, Colonia Este'],
            ['name' => 'Laura Sánchez', 'email' => 'laura.sanchez@email.com', 'telefono' => '+1234567897', 'direccion' => 'Calle Nueva 654, Colonia Oeste'],
            ['name' => 'Roberto Torres', 'email' => 'roberto.torres@email.com', 'telefono' => '+1234567898', 'direccion' => 'Av. Central 987, Colonia Centro'],
            ['name' => 'Isabel Ramírez', 'email' => 'isabel.ramirez@email.com', 'telefono' => '+1234567899', 'direccion' => 'Calle Flores 147, Colonia Norte'],
            ['name' => 'Fernando Castro', 'email' => 'fernando.castro@email.com', 'telefono' => '+1234567800', 'direccion' => 'Boulevard Jardines 258, Colonia Sur'],
            ['name' => 'Carmen Morales', 'email' => 'carmen.morales@email.com', 'telefono' => '+1234567801', 'direccion' => 'Av. Revolución 369, Colonia Este'],
            ['name' => 'Diego Herrera', 'email' => 'diego.herrera@email.com', 'telefono' => '+1234567802', 'direccion' => 'Calle Hidalgo 741, Colonia Oeste'],
            ['name' => 'Lucía Vargas', 'email' => 'lucia.vargas@email.com', 'telefono' => '+1234567803', 'direccion' => 'Av. Reforma 852, Colonia Centro'],
            ['name' => 'Andrés Jiménez', 'email' => 'andres.jimenez@email.com', 'telefono' => '+1234567804', 'direccion' => 'Calle Morelos 963, Colonia Norte'],
            ['name' => 'Patricia Ramos', 'email' => 'patricia.ramos@email.com', 'telefono' => '+1234567805', 'direccion' => 'Boulevard Independencia 174, Colonia Sur'],
            ['name' => 'Miguel Santos', 'email' => 'miguel.santos@email.com', 'telefono' => '+1234567806', 'direccion' => 'Av. Juárez 285, Colonia Este'],
            ['name' => 'Sofía Cruz', 'email' => 'sofia.cruz@email.com', 'telefono' => '+1234567807', 'direccion' => 'Calle Allende 396, Colonia Oeste'],
        ];

        foreach ($clientes as $cliente) {
            User::create([
                'name' => $cliente['name'],
                'email' => $cliente['email'],
                'password' => Hash::make('password'),
                'telefono' => $cliente['telefono'],
                'direccion' => $cliente['direccion'],
                'estado' => 'activo',
                'rol' => 'cliente',
                'metodo_autenticacion' => 'email',
                'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($cliente['name']) . '&background=6b7280&color=fff',
            ]);
        }

        $this->command->info('UserSeeder completado: 18 usuarios creados (3 admin + 15 clientes)');
    }
}
