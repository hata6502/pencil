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

    public function fit()
    {
        return view('fit');
    }
}
