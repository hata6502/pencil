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
        <h1>
            <img src="{{ url('images/wing.png') }}" alt="羽根" />
            Hood Pencil
        </h1>
        <h2>プライバシーポリシー</h2>
        <p>
            当アプリケーションでは、アクセス解析として「<a href="https://www.google.com/analytics/terms/jp.html"
                >Googleアナリティクス</a
            >」を利用しています。<br />
            また、エラー収集として「<a href="https://sentry.io/">Sentry</a>」を利用しています。<br />
            送信される情報は匿名で収集されており、個人を特定するものではありません。<br />
        </p>

        <h2>Privacy Policy</h2>
        <p>
            This application uses <a href="https://www.google.com/analytics/terms/jp.html">Google Analytics</a>: access
            log service. <br />
            And uses <a href="https://sentry.io/">Sentry</a>: error logging service. <br />
            These sended informations contain no personal information. <br />
        </p>
    </div>
</div>
@endsection
