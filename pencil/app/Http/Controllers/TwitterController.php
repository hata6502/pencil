<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Abraham\TwitterOAuth\TwitterOAuth;
use Abraham\TwitterOAuth\TwitterOAuthException;
use Illuminate\Support\Facades\Auth;

class TwitterController extends Controller
{
    public function post(Request $request)
    {
        $request->validate([
            'preview' => 'required|max:2097152',
            'text' => 'required|max:1024',
            'reply' => 'max:2048'
        ]);

        $user = Auth::user();
        $twitterOAuth = new TwitterOAuth(
            config('twitter.consumer_key'),
            config('twitter.consumer_secret'),
            $user->token,
            $user->token_secret
        );

        $preview = $twitterOAuth->post('media/upload', ['media_data' => $request->preview], false, true);
        if ($twitterOAuth->getLastHttpCode() != 200) {
            throw new TwitterOAuthException(print_r($preview, true));
        }

        $parameters = [
            'status' => $request->text,
            'media_ids' => $preview->media_id_string
        ];
        if (!empty($request->reply)) {
            $parameters['in_reply_to_status_id'] = $request->reply;
        }

        $status = $twitterOAuth->post('statuses/update', $parameters);
        if ($twitterOAuth->getLastHttpCode() != 200) {
            throw new TwitterOAuthException(print_r($status, true));
        }

        return redirect()->route('top');
    }
}
