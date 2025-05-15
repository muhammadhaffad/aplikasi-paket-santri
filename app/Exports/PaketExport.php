<?php

namespace App\Exports;

use App\Models\Paket;
use App\Models\Santri;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PaketExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public $jenis_paket;
    public function __construct($jenis_paket)
    {
        $this->jenis_paket = $jenis_paket;
    }
    public function collection()
    {
        return Paket::with('asrama', 'paketKategori', 'santri')->where('jenis_paket', $this->jenis_paket)->get();
    }

    public function headings(): array
    {
        return [
            'ID',
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
