<?php

namespace App\Http\Controllers;

use Socialite;
use App\User;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function twitterLogin()
    {
        if (app()->isLocal()) {
            return $this->login(
                config('twitter.user_id'),
                config('twitter.access_token'),
                config('twitter.access_token_secret')
            );
        }

        return Socialite::driver('twitter')->redirect();
    }

    public function twitterCallback()
    {
        $twitterUser = Socialite::driver('twitter')->user();
        return $this->login($twitterUser->id, $twitterUser->token, $twitterUser->tokenSecret);
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('top');
    }

    private function login(int $id, string $token, string $tokenSecret)
    {
        Auth::login(
            User::updateOrCreate(
                ['id' => $id],
                [
                    'token' => $token,
                    'token_secret' => $tokenSecret
                ]
            )
        );

        return redirect()->intended();
    }
}
