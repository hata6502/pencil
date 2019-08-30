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

    public function backup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'drawing' => 'required|max:65536'
        ]);

        if ($validator->fails()) {
            return response(['errors' => $validator->errors()->all()], 422);
        }

        return ['message' => "現在サーバー保存機能は実装されていません。\nもうしばらくお待ちください。"];
    }
}
