<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@extends('html') @section('meta') @include('meta', [ 'title' => '16:9 画像フィットツール', 'description' => '画像を 16:9
にフィットさせるツールです。']) @endsection @section('content')
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

<div class="article article-draw">
    <h2>16:9 画像フィットツール</h2>
    <p>
        画像を 16:9 のアスペクト比になるようにフィットさせるツールです。<br />
        トリミングのような画像切り抜きではなく、帯をつけることでアスペクト比を調整します。<br />
        画像をサーバに送信せずブラウザのみで画像を加工しますので、お気軽ご自由にご利用ください。
    </p>
    <br />
    <ul>
        <li>対応形式：PNG, JPEG</li>
    </ul>
    <br />
    <input accept="image/png,image/jpeg" id="input" type="file" /><br />
    <br />
    <p>
        ファイルを選択後、↓に表示される画像を保存！
    </p>
    <!-- htmllint attr-bans="[]" img-req-alt="false" img-req-src="false" -->
    <img id="img" style="max-width: 320px; height: auto; " />
    <!-- htmllint attr-bans="$previous" img-req-alt="$previous" img-req-src="$previous" -->
    <script src="{{ mix('/js/fit.js') }}"></script>
</div>
@endsection
