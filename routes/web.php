<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/properties', [PageController::class, 'properties'])->name('properties');
Route::get('/property/{property}', [PageController::class, 'property'])->name('property.show');
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/blog/{blog}', [PageController::class, 'blogDetail'])->name('blog.show');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [PageController::class, 'sendContact'])->name('contact.send');
Route::get('/services', [PageController::class, 'services'])->name('services');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/orders/{order}/receipt', [PageController::class, 'receipt'])->name('orders.receipt');

Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
