<?php
namespace App\Services;

use App;

class AccessControlService {
    public function getMenus() {
        return App\Models\Menu::all();
    }
}