<?php

namespace App\Http\Controllers;

use Socialite;
use App\User;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login()
    {
        return Socialite::driver('twitter')->redirect();
    }

    public function callback()
    {
        $twitterUser = Socialite::driver('twitter')->user();
        $user = User::updateOrCreate(
            ['id' => $twitterUser->id],
            [
                'token' => $twitterUser->token,
                'token_secret' => $twitterUser->tokenSecret
            ]
        );
        Auth::login($user);

        return redirect()->intended();
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('top');
    }
}
