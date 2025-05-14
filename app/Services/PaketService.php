<?php

namespace App\Services;

use App;

class PaketService
{
    public function getPakets($search, $limit, $skip, $sortOrder, $sortField, $paketType = 'all')
    {
        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['nama', 'paketKategori_id', 'santri_nis', 'tanggal_diterima', 'keterangan_disita', 'status', 'jenis_paket'])) {
            $sortField = 'nama';
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
}