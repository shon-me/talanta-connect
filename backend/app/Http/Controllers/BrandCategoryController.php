<?php

namespace App\Http\Controllers;

use App\Models\Brand_category;
use Illuminate\Http\Request;

class BrandCategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique',
            'description' => 'nullable|string|max:300',
            'brand_id' => 'nullable|integer|exsits:brand,id'
        ]);

        $brand_categorey = new Brand_category();
        $brand_categorey->name = $request->name;
        $brand_categorey->description = $request->description;
        $brand_categorey->brand_id = $request->brand_id;

        try {
            $brand_categorey->save();
            return response()->json([
                'message' => 'Record saved successfuly.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to save recoed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $brand_categorey = Brand_category::all();
            return response()->json([
                'Brand categories' => $brand_categorey
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
            $brand_categorey = Brand_category::where('id', $id)->first();
            return response()->json([
                'Brand category' => $brand_categorey
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
            'name' => 'required|string',
            'description' => 'nullable|string|max:300',
            'brand_id' => 'nullable|integer|exsits:brand,id'
        ]);

        $brand_categorey = Brand_category::where('id', $id)->first();
        $brand_categorey->name = $request->name;
        $brand_categorey->description = $request->description;
        $brand_categorey->brand_id = $request->brand_id;

        try {
            $brand_categorey->save();
            return response()->json([
                'message' => 'Record updated successfuly.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update recoed.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $brand_categorey = Brand_category::where('id', $id)->first();
        try {
            if (!$id) {
                return response()->json(['Record not found'], 401);
            } else {
                $brand_categorey->delete();
                return response()->json(['Record deleted successfully'], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete record',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
