<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Abraham\TwitterOAuth\TwitterOAuth;
use Abraham\TwitterOAuth\TwitterOAuthException;
use Illuminate\Support\Facades\Auth;

class TwitterController extends Controller
{
    public function post()
    {
        $user = Auth::user();
        $twitterOAuth = new TwitterOAuth(
            config('twitteroauth.consumer_key'),
            config('twitteroauth.consumer_secret'),
            $user->token,
            $user->token_secret
        );

        $status = $twitterOAuth->post('statuses/update', ['status' => '#HoodPencil Twitter API テストです。']);
        if ($twitterOAuth->getLastHttpCode() != 200) {
            throw new TwitterOAuthException(print_r($status, true));
        }
    }
}
