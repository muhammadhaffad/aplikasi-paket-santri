<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessControlController extends Controller
{
    public function __construct(protected \App\Services\AccessControlService $accessControlService)
    {
    }

    public function getPermissions(Request $request)
    {
        return response()->json($this->accessControlService->getPermissions($request->input('search'), $request->input('limit'), $request->input('skip'), $request->input('sortOrder'), $request->input('sortField')));
    }

    public function getRoles(Request $request)
    {
        return response()->json($this->accessControlService->getRoles($request->input('search'), $request->input('limit'), $request->input('skip'), $request->input('sortOrder'), $request->input('sortField')));
    }

    public function editRole($id)
    {
        $role = $this->accessControlService->getRole($id);
        return Inertia::render('Role/Edit', [
            'data' => $role,
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $this->accessControlService->updateRole($id, $request->all());
        return redirect()->route('access-control.role');
    }

    public function deleteRole($id)
    {
        $this->accessControlService->deleteRole($id);
        return redirect()->route('access-control.role');
    }

    public function storeRole(Request $request)
    {
        $this->accessControlService->storeRole($request->all());
        return redirect()->route('access-control.role');
    }

    public function getMenus(Request $request)
    {
        return response()->json($this->accessControlService->getMenus($request->input('search'), $request->input('limit'), $request->input('skip'), $request->input('sortOrder'), $request->input('sortField')));
    }
}
