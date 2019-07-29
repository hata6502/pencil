<?php

namespace App\Http\Controllers\Auth;

use Socialite;
use App\User;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login()
    {
        return Socialite::driver('twitter')->redirect();
    }

    public function callback()
    {
        $twitterUser = Socialite::driver('twitter')->user();
        $user = User::updateOrCreate([
            'id' => $twitterUser->id
        ]);
        Auth::login($user);

        return redirect()->intended();
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('top');
    }
}
