<?php
namespace App\Services;

use App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AccessControlService {
    public function getMenus($search, $limit, $skip, $sortOrder, $sortField, $all = false) {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['id', 'nama', 'order_number'])) {
            $sortField = 'order_number';
        }

        $query = App\Models\Menu::query();
        if ($search) {
            $query->where('nama', 'ilike', "%{$search}%");
        }
        $total = clone $query;
        if ($sortField && $sortOrder) {
            $query->orderBy($sortField, $sortOrder);
        }
        
        return [
            'items' => $all ? $query->get() : $query->offset($skip)->limit($limit)->get(),
            'meta' => [
                'total' => $total->count(),
                'limit' => $limit,
                'skip' => $skip,
            ]
        ];
    }

    public function getRoles($search, $limit, $skip, $sortOrder, $sortField) {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['id', 'nama'])) {
            $sortField = 'nama';
        }

        $query = App\Models\Role::with('permissions');
        if ($search) {
            $query->where('nama', 'ilike', "%{$search}%");
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

    public function getPermissions($search, $limit, $skip, $sortOrder, $sortField) {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['id', 'nama'])) {
            $sortField = 'nama';
        }

        $query = App\Models\Permission::query();
        if ($search) {
            $query->where('nama', 'ilike', "%{$search}%");
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

    public function storeRole($data) {
        $data = Validator::make($data, [
            'nama' => 'required|max:100',
            'permissions' => 'required|array',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        $data = $data->validated();

        $role = App\Models\Role::create($data);
        $role->permissions()->sync($data['permissions']);
        return $role;
    }

    public function getRole($id) {
        return App\Models\Role::with('permissions')->findOrFail($id);
    }

    public function deleteRole($id) {
        $role = App\Models\Role::findOrFail($id);
        $role->permissions()->detach();
        $role->delete();
    }

    public function updateRole($id, $data) {
        $data = Validator::make($data, [
            'nama' => 'required|max:100',
            'permissions' => 'required|array',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        $data = $data->validated();

        $role = App\Models\Role::findOrFail($id);
        $role->update($data);
        $role->permissions()->sync($data['permissions']);
        return $role->refresh();
    }
}