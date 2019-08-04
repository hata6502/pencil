@extends('html')
<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@section('meta') @include('meta', [ 'title' => 'そのページは見つかりません', 'description' => 'この URL
に対するページは、削除または移動されたかもしれません。', ]) @endsection
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

@section('content')
<div class="error">
    <div>
        <img src="{{ url('images/animals/猫.png') }}" alt="猫" />
        <h1>そのページは見つかりません</h1>
        <p>この URL に対するページは、削除または移動されたかもしれません。</p>
        <a class="button-primary" href="{{ route('top') }}">トップページに戻る</a>
    </div>
</div>
@endsection
