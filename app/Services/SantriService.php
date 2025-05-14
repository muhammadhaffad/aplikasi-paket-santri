<?php
namespace App\Services;

use App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SantriService {
    public function getSantri($search, $limit, $skip, $sortOrder, $sortField) {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['nis', 'nama', 'asrama_id'])) {
            $sortField = 'nis';
        }
        $total = App\Models\Santri::with('asrama');
        if ($search) {
            $total->where('nis', 'ilike', "%{$search}%")
                ->orWhere('nama', 'ilike', "%{$search}%");
        }
        $total = $total->count();

        $query = App\Models\Santri::with('asrama');
        if ($search) {
            $query->where('nis', 'ilike', "%{$search}%")
                ->orWhere('nama', 'ilike', "%{$search}%");
        }
        if ($sortField && $sortOrder) {
            $query->orderBy($sortField, $sortOrder);
        }
        return [
            'items' => $query->offset($skip)->limit($limit)->get(),
            'meta' => [
                'total' => $total,
                'limit' => $limit,
                'skip' => $skip,
            ]
        ];
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

    public function destroy($nis) {
        $santri = App\Models\Santri::find($nis);
        $santri->delete();
        return $santri;
    }

    public function show($nis) {
        return App\Models\Santri::find($nis)->load('asrama');
    }

    public function update($data, $nis) {
        $data = Validator::make($data, [
            'asrama_id' => 'required|exists:asramas,id',
            'nama' => 'required|max:100',
            'alamat' => 'required|max:200',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        
        $data = $data->validated();
        return App\Models\Santri::find($nis)->update($data);
    }
}
