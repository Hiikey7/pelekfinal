<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function login(): View|RedirectResponse
    {
        if (session('admin_authenticated')) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.login');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $adminEmail = (string) config('admin.email');
        $adminPassword = (string) config('admin.password');

        if (
            hash_equals($adminEmail, $credentials['email']) &&
            hash_equals($adminPassword, $credentials['password'])
        ) {
            $request->session()->regenerate();
            session(['admin_authenticated' => true]);

            return redirect()->route('admin.dashboard');
        }

        return back()
            ->withErrors(['email' => 'The provided admin credentials are incorrect.'])
            ->onlyInput('email');
    }

    public function dashboard(): View|RedirectResponse
    {
        if (! session('admin_authenticated')) {
            return redirect()->route('admin.login');
        }

        return view('admin.dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('admin_authenticated');
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
