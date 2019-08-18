<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

class TopController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function draw()
    {
        return view('draw');
    }

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
}
