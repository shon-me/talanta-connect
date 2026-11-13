<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BrandsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:user,id',
            'bio' => 'nullable|string|max:300',
            'categories_ids' => 'array',
            'categories_ids.*' => 'exists:barnd_categories,id'
        ]);

        $user = $request->user();

        $slug = Str::slug($user->name);
        $base = $slug;
        $i = 2;

        while (Brands::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        $brand = new Brands();
        $brand->user_id = $request->user_id;
        $brand->bio = $request->bio;
        $brand->categories()->sync($data['category_ids'] ?? []);

        try {
            $brand->save();
            return response()->json([
                'message' => 'Record saved successfully.',
                'brand' => $brand
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'mesage' => 'Failed to save record.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $brand = Brands::all();
            return response()->json([
                'brand' => $brand
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $brand = Brands::where('id', $id)->first();
            return response()->json([
                'brand' => $brand
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'bio' => 'nullable|string|max:300',
            'categories_ids' => 'array',
            'categories_ids.*' => 'exists:barnd_categories,id'
        ]);

        $brand = Brands::where('id', $id)->first();
        $brand->bio = $request->bio;
        $brand->categories()->sync($data['category_ids'] ?? []);

        try {
            $brand->save();

            return response()->json([
                'message' => 'Record updated successfully.',
                'brand' => $brand
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'mesage' => 'Failed to update record.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $brand = Brands::where('id', $id)->first();
            if ($brand) {
                $brand->delete();
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
