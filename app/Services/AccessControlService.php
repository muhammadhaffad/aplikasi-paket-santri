<?php
namespace App\Services;

use App;

class AccessControlService {
    public function getMenus() {
        return App\Models\Menu::query()->orderBy('order_number')->get();
    }
}