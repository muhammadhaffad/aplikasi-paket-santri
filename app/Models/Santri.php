<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Santri extends Model
{
    use HasFactory;

    protected $primaryKey = 'nis';

    protected $keyType = 'string';

    protected $guarded = [
        '',
    ];

    public function asrama()
    {
        return $this->belongsTo(Asrama::class);
    }
}
