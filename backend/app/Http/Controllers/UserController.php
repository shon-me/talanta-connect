<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'user_image' => 'image|mimes:jpg,png,jpeg|max:2048',
            'role_id' => 'required|integer|exists:roles,id'
        ]);

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role_id = $request->role_id;

        if ($request->hasFile('user_image')) {
            $filename = $request->file('user_image')->store('user-images', 'public');
        } else {
            $filename = null;
        }

        $user->user_image = $filename;

        try {
            $user->save();

            return response()->json([
                'message' => 'Record saved successfully.',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save record.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function readAll()
    {
        try {
            $user = User::with('role')->get();
            return response()->json([
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function readUser($id)
    {
        try {
            $user = User::with('role')->where('id', $id)->first();
            return response()->json([
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
            'user_image' => 'image|mimes:jpg,png,jpeg|max:2048',
            'role_id' => 'required|integer|exists:roles,id'
        ]);

        $user = User::where('id', $id)->first();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role_id = $request->role_id;

        if ($request->hasFile('user_image')) {
            $filename = $request->file('user_image')->store('user-images', 'public');
        } else {
            $filename = null;
        }

        $user->user_image = $filename;

        try {
            $user->save();

            return response()->json([
                'message' => 'Record updated successfully.',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update record.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::where('id', $id)->first();
            if ($user) {
                $user->delete();
                return response()->json(['Record deleted successfuly.'], 200);
            } else {
                return response()->json(['Record not found.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
