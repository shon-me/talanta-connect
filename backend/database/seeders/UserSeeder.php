<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Storage::disk('public')->makeDirectory('user-images');
        $imageSource = database_path('seeders/img/apple-touch-icon.png');

        if (File::exists($imageSource)) {
            $fileName = 'user_image' .time() . '.png';
            Storage::disk('public')->put('user-images/' .$fileName, File::get($imageSource));
        }

        $users = [
            [
                'name' => 'ADMIN(Superuser)',
                'email' => 'admintc@talanta.com',
                'password' => '123456789',
                'user_image' => 'user-images/'.$fileName,
                'is_active' => '1',
                'role_name' => 'ADMINISTRATOR',
                'email_verified_at' => now()
            ],

            [
                'name' => 'ADMIN(Staff)',
                'email' => 'adminStafftc@talanta.com',
                'password' => '123456789',
                'user_image' => 'user-images/'.$fileName,
                'is_active' => '1',
                'role_name' => 'STAFF(ADMIN)',
                'email_verified_at' => now()
            ],
        ];

        foreach ($users as $userData) {
            $role = Role::where('name', $userData['role_name'])->first();

            if ($role) {
                unset($userData['role_name']);
                $userData['role_id'] = $role->id;
                User::create($userData);
            }
        }
    }
}
