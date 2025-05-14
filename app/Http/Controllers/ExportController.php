<?php

namespace App\Http\Controllers;

use App\Exports\SantriExport;
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
}
