<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function loadProducts()
    {
        $products = Product::all();
        return response()->json([
            'products' => $products,
        ], 200);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'productName' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'productImage' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $productData = [
            'product_name' => $validated['productName'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
        ];

        // Handle image upload
        if ($request->hasFile('productImage')) {
            $file = $request->file('productImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $moved = $file->move(public_path('uploads/products'), $filename);

            if ($moved) {
                $productData['product_picture'] = 'uploads/products/' . $filename;
            }
        }

        Product::create($productData);

        return response()->json([
            'message' => 'Product created successfully',
        ], 200);
    }

    public function updateProduct(Request $request, $id)
    {
        $validated = $request->validate([
            'productName' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'productImage' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $product = Product::findOrFail($id);

        $updateData = [
            'product_name' => $validated['productName'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
        ];

        // Handle image upload
        if ($request->hasFile('productImage')) {
            // Delete old image if exists
            if ($product->product_picture) {
                Storage::delete('public/' . $product->product_picture);
            }

            $file = $request->file('productImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/products'), $filename);
            $updateData['product_picture'] = 'uploads/products/' . $filename;
        }

        $product->update($updateData);

        return response()->json([
            'message' => 'Product updated successfully',
        ], 200);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);

        // Delete product image if exists
        if ($product->product_picture) {
            Storage::delete('public/' . $product->product_picture);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }
}
