<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Socialite;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function login()
    {
        return Socialite::driver('twitter')->redirect();
    }

    public function callback()
    {
        $user = Socialite::driver('twitter')->user();
    }
}
