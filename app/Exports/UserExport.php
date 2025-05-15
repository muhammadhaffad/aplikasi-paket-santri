<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function __construct()
    {
        
    }
    public function collection()
    {
        return User::get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama',
            'Email',
            // 'Role',
            'Dibuat pada'
        ];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->email,
            // $row->role,
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
