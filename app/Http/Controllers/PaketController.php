<?php

namespace App\Http\Controllers;

use App;
use Illuminate\Http\Request;

class PaketController extends Controller
{
    public function __construct(
        protected App\Services\PaketService $paketService
    ) {}
    public function getPakets(Request $request)
    {
        $data = $this->paketService->getPakets($request->search, $request->limit, $request->skip, $request->sortOrder, $request->sortField, $request->input('jenis_paket', 'all'));
        return response()->json($data);
    }
}
