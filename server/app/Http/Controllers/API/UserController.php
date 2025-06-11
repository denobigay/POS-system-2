<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function loadUsers()
    {
        $users = User::with('role')->get();
        return response()->json([
            'users' => $users,
        ], 200);
    }

    public function storeUser(Request $request)
    {
        Log::info('Has file: ' . ($request->hasFile('profileImage') ? 'yes' : 'no'));
        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:55'],
            'middleName' => ['nullable', 'string', 'max:55'],
            'lastName' => ['required', 'string', 'max:55'],
            'suffixName' => ['nullable', 'string', 'max:55'],
            'age' => ['required', 'string'],
            'gender' => ['required', Rule::in(['female', 'male', 'others'])],
            'contact' => ['required', 'string', 'max:55'],
            'address' => ['required', 'string', 'max:255'],
            'roleId' => ['required', 'exists:tbl_roles,role_id'],
            'email' => ['required', 'email', 'max:55', 'unique:tbl_users,email'],
            'password' => ['required', 'string', 'min:8'],
            'profileImage' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $userData = [
            'first_name' => $validated['firstName'],
            'middle_name' => $validated['middleName'],
            'last_name' => $validated['lastName'],
            'suffix_name' => $validated['suffixName'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'contact' => $validated['contact'],
            'address' => $validated['address'],
            'role_id' => $validated['roleId'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ];

        // Handle image upload
        if ($request->hasFile('profileImage')) {
            $file = $request->file('profileImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $moved = $file->move(public_path('uploads'), $filename);
            Log::info('File move result: ' . ($moved ? 'success' : 'fail'));
            if ($moved) {
                $userData['profile_image'] = 'uploads/' . $filename;
                Log::info('Set profile_image: ' . $userData['profile_image']);
            }
        } else {
            Log::info('No file received in storeUser');
        }

        Log::info('User data to be saved: ' . json_encode($userData));
        User::create($userData);

        return response()->json([
            'message' => 'User created successfully',
        ], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:55'],
            'middleName' => ['nullable', 'string', 'max:55'],
            'lastName' => ['required', 'string', 'max:55'],
            'suffixName' => ['nullable', 'string', 'max:55'],
            'age' => ['required', 'string'],
            'gender' => ['required', Rule::in(['female', 'male', 'others'])],
            'contact' => ['required', 'string', 'max:55'],
            'address' => ['required', 'string', 'max:255'],
            'roleId' => ['required', 'exists:tbl_roles,role_id'],
            'email' => ['required', 'email', 'max:55', Rule::unique('tbl_users', 'email')->ignore($id, 'user_id')],
            'password' => ['nullable', 'string', 'min:8'],
            'profileImage' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $user = User::findOrFail($id);

        $updateData = [
            'first_name' => $validated['firstName'],
            'middle_name' => $validated['middleName'],
            'last_name' => $validated['lastName'],
            'suffix_name' => $validated['suffixName'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'contact' => $validated['contact'],
            'address' => $validated['address'],
            'role_id' => $validated['roleId'],
            'email' => $validated['email'],
        ];

        // Only update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Handle image upload
        if ($request->hasFile('profileImage')) {
            // Delete old image if exists
            if ($user->profile_image) {
                Storage::delete('public/' . $user->profile_image);
            }

            $file = $request->file('profileImage');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads'), $filename);
            $updateData['profile_image'] = 'uploads/' . $filename;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
        ], 200);
    }

    public function deleteUser($id)
    {
        try {
        $user = User::findOrFail($id);

            // Check if user has any orders
            if ($user->orders()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete user because they have associated orders',
                ], 422);
            }

        // Delete profile image if exists
        if ($user->profile_image) {
            Storage::delete('public/' . $user->profile_image);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting user: ' . $e->getMessage(),
            ], 500);
        }
    }
}
