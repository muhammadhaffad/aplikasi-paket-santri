<?php
namespace App\Services;

use App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserService {
    public function getUsers($search, $limit, $skip, $sortOrder, $sortField) {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['id', 'name', 'email'])) {
            $sortField = 'id';
        }

        $query = App\Models\User::with('role');
        if ($search) {
            $query->where('name', 'ilike', "%{$search}%")
            ->orWhere('email', 'ilike', "%{$search}%");
        }
        $total = clone $query;
        if ($sortField && $sortOrder) {
            $query->orderBy($sortField, $sortOrder);
        }
        return [
            'items' => $query->offset($skip)->limit($limit)->get(),
            'meta' => [
                'total' => $total->count(),
                'limit' => $limit,
                'skip' => $skip,
            ]
        ];
    }
    public function store($data) {
        $data = Validator::make($data, [
            'name' => 'required|max:100',
            'email' => 'required|unique:users,email|max:100',
            'password' => 'required|confirmed|min:8|max:100',
            'role_id' => 'required|exists:roles,id',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        
        $data = $data->validated();
        return App\Models\User::create($data);
    }

    public function destroy($id) {
        $user = App\Models\User::findOrFail($id);
        $user->delete();
        return $user;
    }

    public function show($id) {
        return App\Models\User::findOrFail($id);
    }

    public function update($data, $id) {
        $data = Validator::make($data, [
            'name' => 'required|max:100',
            'email' => 'required|max:100',
            'password' => 'nullable|max:100',
            'role_id' => 'required|exists:roles,id',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }

        
        $data = $data->validated();
        if ($data['password']) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }
        return App\Models\User::findOrFail($id)->update($data);
    }
}
