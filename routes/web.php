<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PublicStorageController;
use Illuminate\Support\Facades\Route;

Route::get('/storage/{path}', [PublicStorageController::class, 'show'])
    ->where('path', '.*')
    ->name('public-storage.show');

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/properties', [PageController::class, 'properties'])->name('properties');
Route::get('/property/{property}', [PageController::class, 'property'])->name('property.show');
Route::get('/blog', [PageController::class, 'blog'])->name('blog');
Route::get('/blog/{blog}', [PageController::class, 'blogDetail'])->name('blog.show');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [PageController::class, 'sendContact'])->name('contact.send');
Route::get('/favorites', [PageController::class, 'favorites'])->name('favorites');
Route::get('/services', [PageController::class, 'services'])->name('services');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');
Route::get('/orders/{order}/receipt', [PageController::class, 'receipt'])->name('orders.receipt');

Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
Route::post('/admin/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
Route::post('/admin/properties', [AdminController::class, 'storeProperty'])->name('admin.properties.store');
Route::put('/admin/properties/{property}', [AdminController::class, 'updateProperty'])->name('admin.properties.update');
Route::delete('/admin/properties/{property}', [AdminController::class, 'deleteProperty'])->name('admin.properties.delete');
Route::post('/admin/amenities', [AdminController::class, 'storeAmenity'])->name('admin.amenities.store');
Route::put('/admin/amenities/{id}', [AdminController::class, 'updateAmenity'])->name('admin.amenities.update');
Route::delete('/admin/amenities/{id}', [AdminController::class, 'deleteAmenity'])->name('admin.amenities.delete');
Route::post('/admin/expenses', [AdminController::class, 'storeExpense'])->name('admin.expenses.store');
Route::put('/admin/expenses/{id}', [AdminController::class, 'updateExpense'])->name('admin.expenses.update');
Route::delete('/admin/expenses/{id}', [AdminController::class, 'deleteExpense'])->name('admin.expenses.delete');
Route::post('/admin/orders', [AdminController::class, 'storeOrder'])->name('admin.orders.store');
Route::get('/admin/orders/export', [AdminController::class, 'exportOrders'])->name('admin.orders.export');
Route::post('/admin/blogs', [AdminController::class, 'storeBlog'])->name('admin.blogs.store');
Route::put('/admin/blogs/{blog}', [AdminController::class, 'updateBlog'])->name('admin.blogs.update');
Route::delete('/admin/blogs/{blog}', [AdminController::class, 'deleteBlog'])->name('admin.blogs.delete');
Route::post('/admin/reviews', [AdminController::class, 'storeReview'])->name('admin.reviews.store');
Route::put('/admin/reviews/{review}', [AdminController::class, 'updateReview'])->name('admin.reviews.update');
Route::delete('/admin/reviews/{review}', [AdminController::class, 'deleteReview'])->name('admin.reviews.delete');
Route::post('/admin/offers', [AdminController::class, 'storeOffer'])->name('admin.offers.store');
Route::get('/admin/{section}', [AdminController::class, 'section'])->name('admin.section');
