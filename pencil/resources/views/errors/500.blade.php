@extends('html')
<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@section('meta') @include('meta', [ 'title' => 'エラーが発生しました', 'description' =>
'エラー情報を'.config('maintainer.name').' にお寄せください。申し訳ありません。', ]) @endsection
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

@section('content')
<div class="error">
    <div>
        <img src="{{ url('images/animals/コブラ.png') }}" alt="コブラ" />
        <h1>エラーが発生しました</h1>
        <p>
            エラー情報を
            <a href="{{ config('maintainer.url') }}" target="_blank" rel="noopener">{{ config('maintainer.name') }}</a>
            にお寄せください。 申し訳ありません。
        </p>
        <a class="button-danger" href="{{ route('top') }}">トップページに戻る</a>
    </div>
</div>
@endsection
