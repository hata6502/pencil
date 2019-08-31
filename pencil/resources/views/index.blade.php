@extends('html')
<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@section('meta') @include('meta', [ 'description' => 'Twitter に直接投稿できる気軽なお絵かきサービスです。', ]) {{--
画像の上からお絵かきを重ねたり、自分の気持ちをアイコンで添えることもできます。 --}} @endsection
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

@section('content')
<div class="top container">
    <div>
        <div class="header">
            @php $landscapes = glob(public_path('images/landscapes/*.png')); $landscapeUrl =
            url(str_replace(public_path(), '', $landscapes[array_rand($landscapes)])); $landscapeAlt =
            basename($landscapeUrl, '.png'); $animals = glob(public_path('images/animals/*.png')); $animalUrl =
            url(str_replace(public_path(), '', $animals[array_rand($animals)])); $animalAlt = basename($animalUrl,
            '.png'); @endphp

            <div class="horizon"></div>
            <img class="landscape" src="{{ $landscapeUrl }}" alt="{{ $landscapeAlt }}" />
            <img class="animal" src="{{ $animalUrl }}" alt="{{ $animalAlt }}" />
            <h1>
                <img src="{{ url('images/wing.png') }}" alt="羽根" />
                Hood Pencil
            </h1>
        </div>

        <p>
            Beta Version
        </p>

        <h2>利用規約・プライバシーポリシー</h2>
        <p>
            当アプリケーションでは、アクセス解析として「<a href="https://www.google.com/analytics/terms/jp.html"
                >Googleアナリティクス</a
            >」を利用しています。<br />
            また、エラー収集として「<a href="https://sentry.io/">Sentry</a>」を利用しています。<br />
            送信される情報は匿名で収集されており、個人を特定するものではありません。
        </p>
        <p>
            お絵かきデータは、バックアップのために HoodPencil サーバへ自動で定期的にアップロードされます。<br />
            当アプリケーションで発生する通信料は利用者負担となります。
        </p>

        <a href="{{ route('draw') }}">ログイン</a>
    </div>
</div>
@endsection
