<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaketController extends Controller
{
    public function __construct(
        protected App\Services\PaketService $paketService,
        protected App\Services\DataMasterService $dataMasterService
    ) {}
    public function getPakets(Request $request)
    {
        $data = $this->paketService->getPakets($request->search, $request->limit, $request->skip, $request->sortOrder, $request->sortField, $request->input('jenis_paket', 'all'));
        return response()->json($data);
    }
    public function create($jenisPaket)
    {
        return Inertia::render('Paket/Create', [
            'jenis_paket' => $jenisPaket,
            'asramas' => $this->dataMasterService->getAsramas(),
            'paketKategoris' => $this->dataMasterService->getPaketKategoris(),
        ]);
    }
    public function store(Request $request, $jenisPaket)
    {
        try {
            $this->paketService->store($request->all(), $jenisPaket);
            return back()->with('success', 'Paket berhasil ditambahkan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menambahkan paket: ' . $e->getMessage(),
            ]);
        }
    }

    public function destroy($id)
    {
        try {
            $this->paketService->destroy($id);
            return back()->with('success', 'Paket berhasil dihapus');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus paket: ' . $e->getMessage(),
            ]);
        }
    }

    public function show($id, $jenisPaket)
    {
        $data = $this->paketService->show($id, $jenisPaket);
        return Inertia::render('Paket/Show', [
            'data' => $data,
            'jenis_paket' => $jenisPaket,
        ]);
    }

    public function edit($id, $jenisPaket)
    {
        $data = $this->paketService->show($id, $jenisPaket);
        return Inertia::render('Paket/Edit', [
            'paket' => $data,
            'jenis_paket' => $jenisPaket,
            'asramas' => $this->dataMasterService->getAsramas(),
            'paketKategoris' => $this->dataMasterService->getPaketKategoris(),
        ]);
    }

    public function update(Request $request, $id, $jenisPaket)
    {
        try {
            $this->paketService->update($request->all(), $id, $jenisPaket);
            return back()->with('success', 'Paket berhasil diubah');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal mengubah paket: ' . $e->getMessage(),
            ]);
        }
    }
}
