<?php

namespace App\Exports;

use App;
use App\Models\Paket;
use App\Models\Santri;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $laporanService;
    protected $filters;
    public function __construct($filters)
    {
        $this->filters = $filters;
        $this->laporanService = new App\Services\LaporanService();
    }
    public function collection()
    {
        if (!empty(@$this->filters['rentangTanggal']['column']) && !empty(@$this->filters['rentangTanggal']['start']) && !empty(@$this->filters['rentangTanggal']['end'])) {
            $this->laporanService->setRentangTanggal($this->filters['rentangTanggal']['column'], $this->filters['rentangTanggal']['start'], $this->filters['rentangTanggal']['end']);
        }
        if (!empty(@$this->filters['jenisPaket'])) {
            $this->laporanService->setJenisPaket($this->filters['jenisPaket']);
        }
        if (!empty(@$this->filters['kategoriPakets'])) {
            foreach ($this->filters['kategoriPakets'] as $kategoriPaket) {
                $this->laporanService->setKategoriPaket($kategoriPaket);
            }
        }
        if (!empty(@$this->filters['isDisita'])) {
            $this->laporanService->setIsDisita($this->filters['isDisita']);
        }
        return $this->laporanService->generateLaporan(0, 0, 'ASC', 'id', true)['items'];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Jenis',
            'NIS',
            'Asrama',
            'Gedung',
            'Penerima',
            'Pengirim',
            'Nama Paket',
            'Kategori',
            'Tanggal Diterima',
            'Keterangan Disita',
            'Status',
            'Dibuat pada'
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->jenis_paket,
            $row->santri->nis,
            $row->asrama->nama,
            $row->asrama->gedung,
            $row->penerima,
            $row->pengirim,
            $row->nama,
            $row->paketKategori->nama,
            ($row->tanggal_diterima ? $row->tanggal_diterima->format('Y-m-d H:i:s') : 'N/A'),
            $row->keterangan_disita,
            $row->status,
            $row->created_at ? $row->created_at->format('Y-m-d H:i:s') : 'N/A',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold
            1 => ['font' => ['bold' => true]],
        ];
    }
}
