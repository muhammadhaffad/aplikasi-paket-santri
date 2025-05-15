<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function __construct(
        protected App\Services\LaporanService $laporanService,
        protected App\Services\DataMasterService $dataMasterService
    ) {}
    public function getLaporan(Request $request)
    {
        if ($request->input('rentang.column') && $request->input('rentang.start') && $request->input('rentang.end')) {
            $this->laporanService->setRentangTanggal($request->input('rentang.column'), $request->input('rentang.start'), $request->input('rentang.end'));
        }
        if ($request->input('jenis_paket')) {
            $this->laporanService->setJenisPaket($request->input('jenis_paket'));
        }
        if ($request->input('kategori_pakets')) {
            foreach ($request->input('kategori_pakets') as $kategoriPaket) {
                $this->laporanService->setKategoriPaket($kategoriPaket);
            }
        }
        if ($request->input('is_disita')) {
            $this->laporanService->setIsDisita($request->input('is_disita'));
        }

        return response()->json($this->laporanService->generateLaporan($request->input('limit'), $request->input('skip'), $request->input('sortOrder'), $request->input('sortField')));
    }

    public function index()
    {
        $paketKategoris = $this->dataMasterService->getPaketKategoris();
        return Inertia::render('Laporan/Index', [
            'paketKategoris' => $paketKategoris,
        ]);
    }
}
