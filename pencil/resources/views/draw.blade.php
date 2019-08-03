<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@extends('html') @section('meta') @include('meta', [ 'title' => 'お絵かきの投稿', ]) @endsection @section('content')
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

<div class="article article-draw">
    <h2>お絵かきの投稿</h2>
    <p>↓タッチするとお絵かきウィンドウが開きます。 Tap or click here to draw.</p>

    <canvas id="preview-canvas"></canvas>

    <form action="{{ route('post') }}" method="POST">
        {{ csrf_field() }}

        <input name="drawing" type="hidden" />
        <input type="submit" value="ツイート" />
    </form>

    <div id="drawing-window">
        <div>
            <div id="drawing-dialog">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div class="drawing-dialog-sidebar">
                                    <button class="palette-button active" data-color="#000000"></button>
                                    <button class="palette-button" data-color="#ffffff"></button>
                                    <button class="palette-button" data-color="#ff0000"></button>
                                    <button class="palette-button" data-color="#00ffff"></button>
                                    <button class="palette-button" data-color="#00ff00"></button>
                                    <button class="palette-button" data-color="#ff00ff"></button>
                                    <button class="palette-button" data-color="#0000ff"></button>
                                    <button class="palette-button" data-color="#ffff00"></button>

                                    <button id="redo-button" class="history-button" disabled>
                                        <img src="{{ url('images/redo.png') }}" alt="やり直し" />
                                    </button>
                                    <button id="undo-button" class="history-button" disabled>
                                        <img src="{{ url('images/undo.png') }}" alt="元に戻す" />
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
                                        <img src="{{ url('images/pencil-light.png') }}" alt="細いペン" />
                                    </button>
                                    <button class="pencil-button active" data-brush="medium">
                                        <img src="{{ url('images/pencil-medium.png') }}" alt="ペン" />
                                    </button>
                                    <button class="pencil-button" data-brush="bold">
                                        <img src="{{ url('images/pencil-bold.png') }}" alt="太いペン" />
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
