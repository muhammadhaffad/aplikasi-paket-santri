<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalPaketBelumDiambil = \App\Models\Paket::where('status', 'Belum Diambil')->count();
        $totalPaketDisita = \App\Models\Paket::where(DB::raw('coalesce(keterangan_disita, \'\')'), '!=', '')->count();
        return Inertia::render('Dashboard', [
            'paketKategoris' => \App\Models\PaketKategori::all(),
            'totalPaketBelumDiambil' => $totalPaketBelumDiambil,
            'totalPaketDisita' => $totalPaketDisita,
        ]);
    }
}
