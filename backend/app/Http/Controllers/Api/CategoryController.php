<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     * Public endpoint: list all categories with listing counts.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('listings')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * GET /api/categories/{id}
     * Public endpoint: get a single category with its listings.
     */
    public function show(Category $category): JsonResponse
    {
        $category->load([
            'listings' => function ($query) {
                $query->active()
                    ->with(['user:id,name', 'photos'])
                    ->paginate(15);
            }
        ])->loadCount('listings');

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }
}
