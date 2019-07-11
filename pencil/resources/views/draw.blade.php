
@extends('html')

@section('meta')
  @include('meta', [
    'title' => 'お絵かきのツイート',
    'description' => 'お絵かきをツイートします。',
  ])
@endsection

@section('content')
  <div class="article article-draw">
    <h2>お絵かきのツイート</h2>
    <canvas id="drawing-canvas"></canvas>
  </div>
@endsection