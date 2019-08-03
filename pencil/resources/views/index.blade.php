@extends('html')
<!-- htmllint preset="none" --><!-- textlint-disable -->
@section('meta') @include('meta', [ 'description' => 'Twitter に直接投稿できる気軽なお絵かきサービスです。', ]) {{--
画像の上からお絵かきを重ねたり、自分の気持ちをアイコンで添えることもできます。 --}} @endsection
<!-- textlint-enable -->
@section('content')
<div class="container">
    <div>
        <h2>Hood Pencil</h2>
        <h3>drawing-beta version</h3>
        <p>Maintainer: <a href="https://twitter.com/bluehood_admin">@bluehood_admin</a><br /><br /></p>
        <p>
            BlueHood 後継お絵かきアプリケーション「Pencil」の drawing-beta 版です。<br />
            お絵かき機能のみ先行公開します。お絵かきの保存や投稿はできません。<br />
            お絵かきの使いやすさなどをフィードバックしてくださるとうれしいです。<br />
            <br />
        </p>
        <p>
            This is drawing-beta version of Pencil: a drawing app post BlueHood. <br />
            It can only drawing, without save drawing and post. <br />
            Please feedback to me about usability and so on! <br />
            <br />
        </p>
        <p>
            プライバシーポリシー<br />
            当アプリケーションでは、アクセス解析として「<a href="https://www.google.com/analytics/terms/jp.html"
                >Googleアナリティクス</a
            >」を利用しています。<br />
            また、エラー収集として「<a href="https://sentry.io/">Sentry</a>」を利用しています。<br />
            送信される情報は匿名で収集されており、個人を特定するものではありません。<br />
            <br />
        </p>
        <p>
            Privacy Policy<br />
            This application uses <a href="https://www.google.com/analytics/terms/jp.html">Google Analytics</a>: access
            log service. <br />
            And uses <a href="https://sentry.io/">Sentry</a>: error logging service. <br />
            These sended informations contain no personal information. <br />
            <br />
        </p>
    </div>
</div>
@endsection
