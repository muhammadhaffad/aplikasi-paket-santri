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

    public function index(Request $request)
    {
        $santri = $this->santriService->getSantri($request->search, $request->limit, $request->skip, $request->sortOrder, $request->sortField);
        return Inertia::render('Santri/Index', [
            'santri' => $santri,
        ]);
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

    public function show($id)
    {
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
    }

    public function destroy($id)
    {
    }
}
