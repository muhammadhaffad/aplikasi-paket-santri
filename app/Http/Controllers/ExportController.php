<?php

namespace App\Http\Controllers;

use App\Exports\LaporanExport;
use App\Exports\PaketExport;
use App\Exports\SantriExport;
use App\Exports\UserExport;
use App\Models\Paket;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function SantriToExcel(Request $request)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-santri-export-' . date('Y-m-d')) . '.xlsx';
        $export = new SantriExport();
        return Excel::download($export, $filename);
    }

    public function SantriToPdf(Request $request)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-santri-export-' . date('Y-m-d')) . '.pdf';
        
        // Get the data based on filters
        $data = \App\Models\Santri::with('asrama')->get();
        
        // Generate PDF
        $pdf = Pdf::loadView('exports.santri-pdf', ['data' => $data]);
        
        // Optional: Set paper size and orientation
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download($filename);
    }

    public function PaketToExcel(Request $request, $jenisPaket)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-paket-' . $jenisPaket . '-export-' . date('Y-m-d')) . '.xlsx';
        $export = new PaketExport($jenisPaket);
        return Excel::download($export, $filename);
    }

    public function PaketToPdf(Request $request, $jenisPaket)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-paket-' . $jenisPaket . '-export-' . date('Y-m-d')) . '.pdf';
        
        // Get the data based on filters
        $data = Paket::with('asrama', 'paketKategori', 'santri')->where('jenis_paket', $jenisPaket)->get();
        
        // Generate PDF
        $pdf = Pdf::loadView('exports.paket-pdf', ['data' => $data, 'jenisPaket' => $jenisPaket]);
        
        // Optional: Set paper size and orientation
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download($filename);
    }

    public function LaporanToExcel(Request $request)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-laporan-export-' . date('Y-m-d')) . '.xlsx';
        $export = new LaporanExport($request->all());
        return Excel::download($export, $filename);
    }
    
    public function UserToExcel(Request $request)
    {
        // Validate request
        $request->validate([
            'filename' => 'nullable|string|max:255',
        ]);
        
        $filename = $request->input('filename', 'data-user-export-' . date('Y-m-d')) . '.xlsx';
        $export = new UserExport();
        return Excel::download($export, $filename);
    }
}
