<?php
namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    public function update(array $data) {
        $data = Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(\App\Models\User::class)->ignore(request()->user()->id)],
        ]);

        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }

        request()->user()->fill($data->validated());

        if (request()->user()->isDirty('email')) {
            request()->user()->email_verified_at = null;
        }

        request()->user()->save();
    }

    public function destroy(array $data) {
        $data = Validator::make($data, [
            'password' => ['required', 'current_password'],
        ]);

        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }

        $user = request()->user();

        Auth::logout();

        $user->delete();

        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }
}