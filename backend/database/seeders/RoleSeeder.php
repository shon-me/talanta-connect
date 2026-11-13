<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name'=>'CREATOR', 'description'=>'Content creator role.', 'permision'=>'creator'],
            ['name'=>'BRAND', 'description'=>'Brand manager role.', 'permision'=>'brand'],
            ['name'=>'STAFF(ADMIN)', 'description'=>'Talanta Connect Staff role.', 'permision'=>'staff'],
            ['name'=>'ADMINISTRATOR', 'description'=>'Talanta Connect Admin role.', 'permision'=>'admin'],
        ];

        foreach ($roles as $role){
            Role::create($role);
        }
    }
}
