<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paket extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
    ];

    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }

    public function paketKategori()
    {
        return $this->belongsTo(PaketKategori::class, 'kategori_id', 'id');
    }

    public function asrama()
    {
        return $this->belongsTo(Asrama::class);
    }
}
