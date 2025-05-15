<?php

namespace App\Http\Middleware;

use App;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => Inertia::lazy(fn() => $request->session()->get('success')),
                'error' => Inertia::lazy(fn() => $request->session()->get('error')),
                'message' => Inertia::lazy(fn() => $request->session()->get('message')),
            ],
            'menus' => app(App\Services\AccessControlService::class)->getMenus('', 0, 0, 'ASC', 'order_number', true)['items']->filter(function ($menu) {
                switch ($menu['route_name']) {
                    case 'dashboard':
                        if (auth()->user()?->role->permissions->contains('nama', 'dashboard_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    case 'santri.index':
                        if (auth()->user()?->role->permissions->contains('nama', 'santri_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    case 'paket.index':
                        if (auth()->user()?->role->permissions->contains('nama', 'paket_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    case 'laporan.index':
                        if (auth()->user()?->role->permissions->contains('nama', 'laporan_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    case 'users.index':
                        if (auth()->user()?->role->permissions->contains('nama', 'users_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    case 'access-control.index':
                        if (auth()->user()?->role->permissions->contains('nama', 'access_control_access') || auth()->user()?->role->permissions->contains('nama', 'all_access')) {
                            return true;
                        }
                        return false;
                    default:
                        return true;
                }
            }),
        ];
    }
}
