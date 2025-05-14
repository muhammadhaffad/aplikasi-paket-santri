<?php

namespace App\Exports;

use App\Models\Santri;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SantriExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function __construct()
    {
        
    }
    public function collection()
    {
        return Santri::with('asrama')->get();
    }

    public function headings(): array
    {
        return [
            'NIS',
            'Nama',
            'Asrama',
            'Gedung',
            'Alamat',
            'Dibuat pada'
        ];
    }

    public function map($row): array
    {
        return [
            $row->nis,
            $row->nama,
            $row->asrama->nama,
            $row->asrama->gedung,
            $row->alamat,
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
