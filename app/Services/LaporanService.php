<?php
namespace App\Services;

use App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LaporanService
{
    protected $rentangTanggal;
    protected $jenisPaket;
    protected array $kategoriPaket = [];
    protected $isDisita;

    public function setRentangTanggal($column, $start, $end)
    {
        $validator = Validator::make([
            'column' => $column,
            'start' => $start,
            'end' => $end,
        ], [
            'column' => 'required|in:tanggal_diterima,created_at',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }
        $this->rentangTanggal = [$column, $start, $end];
        return $this;
    }

    public function setJenisPaket($jenisPaket)
    {
        $validator = Validator::make([
            'jenisPaket' => $jenisPaket,
        ], [
            'jenisPaket' => 'required|in:masuk,keluar',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }
        $this->jenisPaket = $jenisPaket;
        return $this;
    }

    public function setKategoriPaket($kategoriPaket)
    {
        $validator = Validator::make([
            'kategoriPaket' => $kategoriPaket,
        ], [
            'kategoriPaket' => 'nullable|exists:paket_kategoris,id',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }
        $this->kategoriPaket[] = $kategoriPaket;
        return $this;
    }

    public function setIsDisita($isDisita)
    {
        $validator = Validator::make([
            'isDisita' => $isDisita,
        ], [
            'isDisita' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }
        $this->isDisita = $isDisita;
        return $this;
    }

    public function generateLaporan($limit, $skip, $sortOrder, $sortField)
    {
        $query = App\Models\Paket::with(['asrama', 'paketKategori', 'santri']);

        if ($this->rentangTanggal) {
            $query->whereBetween($this->rentangTanggal[0], [$this->rentangTanggal[1], $this->rentangTanggal[2]]);
        }

        if ($this->jenisPaket) {
            $query->where('jenis_paket', $this->jenisPaket);
        }

        if ($this->kategoriPaket) {
            $query->whereIn('kategori_id', $this->kategoriPaket);
        }

        if ($this->isDisita !== null) {
            $query->where(DB::raw("coalesce(keterangan_disita, '')"), '!=', '');
        }

        $count = clone $query;
        $count = $count->count();

        if ($limit == 0 || $limit > 50) {
            $limit = 10;
        }
        if (!in_array($sortOrder, ['ASC', 'DESC'])) {
            $sortOrder = 'ASC';
        }
        if (!in_array($sortField, ['id', 'santri_nis', 'asrama_id', 'penerima', 'pengirim', 'nama', 'kategori_id', 'tanggal_diterima', 'status'])) {
            $sortField = 'id';
        }
        $query->orderBy($sortField, $sortOrder);

        return [
            'items' => $query->offset($skip)->limit($limit)->get(),
            'meta' => [
                'total' => $count,
            ]
        ];
    }
}