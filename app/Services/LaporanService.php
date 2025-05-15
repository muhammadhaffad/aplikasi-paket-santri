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

    public function generateLaporan($limit, $skip, $sortOrder, $sortField, $all = false)
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

        if (!$all) {
            if ($limit == 0 || $limit > 50) {
                $limit = 10;
            }
            if (!in_array($sortOrder, ['ASC', 'DESC'])) {
                $sortOrder = 'ASC';
            }
            if (!in_array($sortField, ['id', 'santri_nis', 'asrama_id', 'penerima', 'pengirim', 'nama', 'kategori_id', 'tanggal_diterima', 'status'])) {
                $sortField = 'id';
            }
            $query->offset($skip)->limit($limit);
        }
        $query->orderBy($sortField, $sortOrder);
        return [
            'items' => $query->get(),
            'meta' => [
                'total' => $count,
            ]
        ];
    }

    public function generateStats($periode, $time, $idKategori = null)
    {
        $time = (int)$time;
        $queryDays = "
            WITH date_series AS (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '{$time} days',
                    CURRENT_DATE,
                    INTERVAL '1 day'
                )::DATE AS day
            )
            SELECT 
                ds.day,
                COALESCE(COUNT(dt.tanggal_diterima), 0) AS total,
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'masuk' then dt.tanggal_diterima end), 0) as masuk_kategori," : "") . "
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'keluar' then dt.tanggal_diterima end), 0) as keluar_kategori," : "") . "
                coalesce(count(case when dt.jenis_paket = 'masuk' then dt.tanggal_diterima end),0) as masuk,
                coalesce(count(case when dt.jenis_paket = 'keluar' then dt.tanggal_diterima end),0) as keluar
            FROM 
                date_series ds
            LEFT JOIN 
                pakets dt ON DATE(dt.tanggal_diterima) = ds.day
            GROUP BY 
                ds.day
            ORDER BY 
                ds.day;
        ";
        $queryWeeks = "
            WITH week_series AS (
                SELECT generate_series(
                    DATE_TRUNC('week', CURRENT_DATE - INTERVAL '{$time} weeks'),
                    DATE_TRUNC('week', CURRENT_DATE),
                    INTERVAL '1 week'
                )::DATE AS week_start
            )
            SELECT 
                ws.week_start,
                COALESCE(COUNT(dt.tanggal_diterima), 0) AS total,
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'masuk' then dt.tanggal_diterima end), 0) as masuk_kategori," : "") . "
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'keluar' then dt.tanggal_diterima end), 0) as keluar_kategori," : "") . "
                coalesce(count(case when dt.jenis_paket = 'masuk' then dt.tanggal_diterima end),0) as masuk,
                coalesce(count(case when dt.jenis_paket = 'keluar' then dt.tanggal_diterima end),0) as keluar
            FROM 
                week_series ws
            LEFT JOIN 
                pakets dt ON DATE_TRUNC('week', dt.tanggal_diterima) = ws.week_start
            GROUP BY 
                ws.week_start
            ORDER BY 
                ws.week_start;
        ";
        $queryMonths = "
            WITH month_series AS (
                SELECT generate_series(
                    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '{$time} months'),
                    DATE_TRUNC('month', CURRENT_DATE),
                    INTERVAL '1 month'
                )::DATE AS month_start
            )
            SELECT 
                ms.month_start,
                COALESCE(COUNT(dt.tanggal_diterima), 0) AS total,
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'masuk' then dt.tanggal_diterima end), 0) as masuk_kategori," : "") . "
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'keluar' then dt.tanggal_diterima end), 0) as keluar_kategori," : "") . "
                coalesce(count(case when dt.jenis_paket = 'masuk' then dt.tanggal_diterima end),0) as masuk,
                coalesce(count(case when dt.jenis_paket = 'keluar' then dt.tanggal_diterima end),0) as keluar
            FROM 
                month_series ms
            LEFT JOIN 
                pakets dt ON DATE_TRUNC('month', dt.tanggal_diterima) = ms.month_start
            GROUP BY 
                ms.month_start
            ORDER BY 
                ms.month_start;
        ";
        $queryYears = "
            WITH year_series AS (
                SELECT generate_series(
                    DATE_TRUNC('year', CURRENT_DATE - INTERVAL '{$time} years'),
                    DATE_TRUNC('year', CURRENT_DATE),
                    INTERVAL '1 year'
                )::DATE AS year_start
            )
            SELECT 
                ys.year_start,
                COALESCE(COUNT(dt.tanggal_diterima), 0) AS total,
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'masuk' then dt.tanggal_diterima end), 0) as masuk_kategori," : "") . "
                " . ( $idKategori ? "coalesce(count(case when dt.kategori_id = {$idKategori} and dt.jenis_paket = 'keluar' then dt.tanggal_diterima end), 0) as keluar_kategori," : "") . "
                coalesce(count(case when dt.jenis_paket = 'masuk' then dt.tanggal_diterima end),0) as masuk,
                coalesce(count(case when dt.jenis_paket = 'keluar' then dt.tanggal_diterima end),0) as keluar
            FROM 
                year_series ys
            LEFT JOIN 
                pakets dt ON DATE_TRUNC('year', dt.tanggal_diterima) = ys.year_start
            GROUP BY 
                ys.year_start
            ORDER BY 
                ys.year_start;
        ";
        
        if ($periode == 'days') {
            $query = $queryDays;
        } elseif ($periode == 'weeks') {
            $query = $queryWeeks;
        } elseif ($periode == 'months') {
            $query = $queryMonths;
        } elseif ($periode == 'years') {
            $query = $queryYears;
        }

        return DB::select($query);
    }
}
