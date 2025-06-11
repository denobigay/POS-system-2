<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|exists:tbl_orders,order_id',
                'rating' => 'nullable|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                'email' => 'nullable|email|max:255',
            ]);

            Feedback::create([
                'order_id' => $validated['order_id'],
                'rating' => $validated['rating'] ?? null,
                'comment' => $validated['comment'] ?? null,
                'email' => $validated['email'] ?? null,
            ]);

            return response()->json([
                'message' => 'Feedback submitted successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error submitting feedback: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error submitting feedback',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function loadFeedbacks()
    {
        try {
            $feedbacks = Feedback::with('order')->get();
            return response()->json([
                'feedbacks' => $feedbacks,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error loading feedbacks: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error loading feedbacks',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
