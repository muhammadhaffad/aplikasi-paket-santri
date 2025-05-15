<?php

namespace App\Services;

use App;

class DataMasterService {
    public function getAsramas() {
        return App\Models\Asrama::query()->get();
    }
    public function getPaketKategoris() {
        return App\Models\PaketKategori::query()->get();
    }
}
