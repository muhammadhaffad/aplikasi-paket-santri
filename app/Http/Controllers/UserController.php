<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected \App\Services\UserService $userService)
    {}
    public function getUsers(Request $request)
    {
        $data = $this->userService->getUsers($request->search, $request->limit, $request->skip, $request->sortOrder, $request->sortField);
        return response()->json($data);
    }
    
    public function index()
    {
        return Inertia::render('User/Index');
    }

    public function create()
    {
        return Inertia::render('User/Create', [
            'roles' => \App\Models\Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $this->userService->store($request->all());
        return redirect()->route('users.index');
    }

    public function edit($id)
    {
        $data = $this->userService->show($id);
        return Inertia::render('User/Edit', [
            'data' => $data,
            'roles' => \App\Models\Role::all(),
        ]);
    }

    public function update($id, Request $request)
    {
        try {
            $this->userService->update($request->all(), $id);
            return back()->with('success', 'User berhasil diubah');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal mengubah user: ' . $e->getMessage(),
            ]);
        }
    }

    public function destroy($id)
    {
        try {
            $this->userService->destroy($id);
            return back()->with('success', 'User berhasil dihapus');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Gagal menghapus user: ' . $e->getMessage(),
            ]);
        }
    }
}
