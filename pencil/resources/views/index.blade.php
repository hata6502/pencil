@extends('html')
<!-- textlint-disable -->
@section('meta') @include('meta', [ 'description' => 'Twitter に直接投稿できる気軽なお絵かきサービスです。', ]) {{--
画像の上からお絵かきを重ねたり、自分の気持ちをアイコンで添えることもできます。 --}} @endsection
<!-- textlint-enable -->
@section('content')
<div class="article article-draw">
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
        logging service. <br />
        And uses <a href="https://sentry.io/">Sentry</a>: error logging service. <br />
        These sended informations contain no personal information. <br />
        <br />
    </p>
    <p>↓タッチするとお絵かきウィンドウが開きます。 Tap or click here to draw.</p>

    <canvas id="preview-canvas"></canvas>
    <div id="drawing-window">
        <div>
            <div id="drawing-dialog">
                {{-- flex 非対応のためテーブルレイアウト --}}
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div class="drawing-dialog-sidebar">
                                    <button class="palette-button active" style="background-color: #000000; "></button>
                                    <button class="palette-button" style="background-color: #ffffff; "></button>
                                    <button class="palette-button" style="background-color: #ff0000; "></button>
                                    <button class="palette-button" style="background-color: #00ffff; "></button>
                                    <button class="palette-button" style="background-color: #00ff00; "></button>
                                    <button class="palette-button" style="background-color: #ff00ff; "></button>
                                    <button class="palette-button" style="background-color: #0000ff; "></button>
                                    <button class="palette-button" style="background-color: #ffff00; "></button>

                                    <button id="redo-button" class="history-button" disabled>
                                        <img src="/images/redo.png" />
                                    </button>
                                    <button id="undo-button" class="history-button" disabled>
                                        <img src="/images/undo.png" />
                                    </button>
                                </div>
                            </td>
                            <td>
                                <div id="stick-cursor">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <canvas id="drawing-canvas"></canvas>
                            </td>
                            <td>
                                <div class="drawing-dialog-sidebar">
                                    <button class="pencil-button" data-brush="light">
                                        <img src="/images/pencil-light.png" />
                                    </button>
                                    <button class="pencil-button active" data-brush="medium">
                                        <img src="/images/pencil-medium.png" />
                                    </button>
                                    <button class="pencil-button" data-brush="bold">
                                        <img src="/images/pencil-bold.png" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input id="text-input" placeholder="テキストを入力して埋め込みます。" />
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
