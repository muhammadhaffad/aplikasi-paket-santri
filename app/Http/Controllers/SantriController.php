<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DataMasterService;
use App\Services\SantriService;
use Inertia\Inertia;

class SantriController extends Controller
{
    public function __construct(
        protected DataMasterService $dataMasterService,
        protected SantriService $santriService)
    {}

    public function getSantri(Request $request)
    {
        $data = $this->santriService->getSantri($request->search, $request->limit, $request->skip, $request->sortOrder, $request->sortField);
        return response()->json($data);
    }

    public function index(Request $request)
    {
        return Inertia::render('Santri/Index');
    }


    public function create()
    {
        $asramas = $this->dataMasterService->getAsramas();
        return Inertia::render('Santri/Create', [
            'asramas' => $asramas,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $this->santriService->store($request->all());
            return back()->with('success', 'Santri berhasil ditambahkan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menambahkan santri: ' . $e->getMessage(),
            ]);
        }
    }

    public function show($nis)
    {
        $data = $this->santriService->show($nis);
        return Inertia::render('Santri/Show', [
            'data' => $data,
            'asramas' => $this->dataMasterService->getAsramas(),
        ]);
    }

    public function edit($nis)
    {
        $data = $this->santriService->show($nis);
        return Inertia::render('Santri/Edit', [
            'data' => $data,
            'asramas' => $this->dataMasterService->getAsramas(),
        ]);
    }

    public function update(Request $request, $nis)
    {
        try {
            $this->santriService->update($request->all(), $nis);
            return back()->with('success', 'Santri berhasil diubah');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal mengubah santri: ' . $e->getMessage(),
            ]);
        }
    }

    public function destroy($nis)
    {
        $santri = $this->santriService->destroy($nis);
        return back()->with('success', 'Santri ' . $santri->nama . ' berhasil dihapus');
    }
}
