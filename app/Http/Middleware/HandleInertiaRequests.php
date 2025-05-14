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
            'menus' => app(App\Services\AccessControlService::class)->getMenus(),
        ];
    }
}
