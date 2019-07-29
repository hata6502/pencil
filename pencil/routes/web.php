<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('', 'TopController@draw')->name('draw');

Route::group(['middleware' => 'auth.very_basic'], function () {
    Route::get('login', 'Auth\LoginController@login')->name('login');
    Route::get('login/callback', 'Auth\LoginController@callback')->name('callback');
});
