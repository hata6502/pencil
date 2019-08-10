<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@extends('html') @section('meta') @include('meta', [ 'title' => 'お絵かきの投稿', ]) @endsection @section('content')
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

<div class="article article-draw">
    <h2>お絵かきの投稿</h2>
    <form action="{{ route('post') }}" method="POST">
        {{ csrf_field() }}

        <input name="drawing" type="hidden" />
        <input type="submit" value="ツイート" />
    </form>
</div>
@endsection
