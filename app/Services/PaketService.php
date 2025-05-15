<?php

namespace App\Services;

use App;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PaketService
{
    public function getPakets($search, $limit, $skip, $sortOrder, $sortField, $paketType = 'all')
    {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'DESC';
        }
        if (!in_array($sortField, ['nama', 'paketKategori_id', 'santri_nis', 'tanggal_diterima', 'keterangan_disita', 'status', 'jenis_paket'])) {
            $sortField = 'id';
        }
        if (!in_array($paketType, ['all', 'masuk', 'keluar'])) {
            $paketType = 'masuk';
        }
        $total = App\Models\Paket::with(['santri', 'paketKategori', 'asrama']);
        if ($search) {
            $total->where('nama', 'ilike', "%{$search}%");
        }
        if ($paketType != 'all') {
            $total->where('jenis_paket', $paketType);
        }
        $total = $total->count();

        $query = App\Models\Paket::with(['santri', 'paketKategori', 'asrama']);
        if ($search) {
            $query->where('nama', 'ilike', "%{$search}%");
        }
        if ($paketType != 'all') {
            $query->where('jenis_paket', $paketType);
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

    public function store($data, $jenisPaket)
    {
        $data = Validator::make($data, [
            'santri_nis' => 'required|exists:santris,nis|max:100',
            'asrama_id' => 'required|exists:asramas,id',
            'nama' => 'required|max:100',
            'kategori_id' => 'required|exists:paket_kategoris,id',
            'pengirim' => 'required|max:100',
            'penerima' => 'required|max:100',
            'tanggal_diterima' => 'nullable|date',
            'keterangan_disita' => 'nullable|max:200',
            'status' => 'required|in:belum diambil,diambil',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        
        $data = $data->validated();
        $data['jenis_paket'] = $jenisPaket;
        $paket = App\Models\Paket::create($data);
        return $paket;
    }

    public function destroy($id)
    {
        $paket = App\Models\Paket::findOrFail($id);
        $paket->delete();
        return $paket;
    }

    public function show($id, $paketType = 'masuk')
    {
        $paket = App\Models\Paket::with(['santri', 'paketKategori', 'asrama'])->where('jenis_paket', $paketType)->findOrFail($id);
        return $paket;
    }

    public function update($data, $id, $jenisPaket)
    {
        $data = Validator::make($data, [
            'santri_nis' => 'required|exists:santris,nis|max:100',
            'asrama_id' => 'required|exists:asramas,id',
            'nama' => 'required|max:100',
            'kategori_id' => 'required|exists:paket_kategoris,id',
            'pengirim' => 'required|max:100',
            'penerima' => 'required|max:100',
            'tanggal_diterima' => 'nullable|date',
            'keterangan_disita' => 'nullable|max:200',
            'status' => 'required|in:belum diambil,diambil',
        ]);
        
        if ($data->fails()) {
            throw ValidationException::withMessages($data->errors()->getMessages());
        }
        
        $data = $data->validated();
        $data['jenis_paket'] = $jenisPaket;
        $paket = App\Models\Paket::findOrFail($id);
        $paket->update($data);
        return $paket;
    }
}