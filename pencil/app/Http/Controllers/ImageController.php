<?php

namespace App\Http\Controllers;

use App\SnapShot;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ImageController extends Controller
{
    public function image(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|mimetypes:image/png,image/jpeg|max:2048'
        ]);

        if ($validator->fails()) {
            // text/html として json をレスポンスします。
            return response(json_encode(['errors' => $validator->errors()->all()]), 422);
        }

        // text/html として json をレスポンスします。
        return json_encode([
            'image' =>
                'data:' .
                $request->image->getMimeType() .
                ';base64,' .
                base64_encode(file_get_contents($request->image->path()))
        ]);
    }

    public function backup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'drawing' => 'required|max:65536'
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        $user = Auth::user();
        $user->drawing = $request->drawing;
        $user->save();

        $snap_shot = new SnapShot();
        $snap_shot->user_id = $user->id;
        $snap_shot->drawing = $request->drawing;
        $snap_shot->save();

        return [];
    }

    public function restore(Request $request)
    {
        return [
            'drawing' => Auth::user()->drawing
        ];
    }
}
