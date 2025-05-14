<?php
namespace App\Services;

use App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SantriService {
    public function getSantri($search, $limit, $skip, $sortOrder, $sortField) {
        if ($limit == 0 || $limit <= 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'asc';
        }
        if (!in_array($sortField, ['nis', 'nama', 'asrama_id'])) {
            $sortField = 'nis';
        }
        $total = App\Models\Santri::query()->count();
        $query = App\Models\Santri::query();
        if ($search) {
            $query->where('nis', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        }
        if ($sortField && $sortOrder) {
            $query->orderBy($sortField, $sortOrder);
        }
        return ['data' => $query->offset($skip)->limit($limit)->get(), 'total' => $total];
    }
    public function store($data) {
        $data = Validator::make($data, [
            'nis' => 'required|unique:santris,nis|max:100',
            'asrama_id' => 'required|exists:asramas,id',
            'nama' => 'required|max:100',
            'alamat' => 'required|max:200',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        
        $data = $data->validated();
        return App\Models\Santri::create($data);
    }
}
