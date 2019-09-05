<!-- htmllint spec-char-escape="false" -->
<!-- textlint-disable -->
@extends('html') @section('meta') @include('meta', [ 'title' => 'お絵かきのツイート', 'description' =>
'お絵かきをツイートします。']) @endsection @section('content')
<!-- htmllint spec-char-escape="$previous" -->
<!-- textlint-enable -->

<div class="article article-draw">
    <h2>お絵かきのツイート</h2>
    <form id="post-form" action="{{ route('post') }}" method="POST">
        {{ csrf_field() }}
    </form>

    <div id="drawing-window">
        <div>
            <div id="drawing-dialog" class="modal-dialog">
                <div id="toolbar">
                    <div>
                        <button id="undo-button" class="history-button" disabled>
                            <img src="{{ url('images/undo.png') }}" alt="元に戻す" />
                        </button>
                        <button id="redo-button" class="history-button" disabled>
                            <img src="{{ url('images/redo.png') }}" alt="やり直し" />
                        </button>
                    </div>
                    <div>
                        <button id="clear-button">
                            <img src="{{ url('images/clear.png') }}" alt="全消し" />
                        </button>
                    </div>
                    <div>
                        <button id="background-button">
                            <img src="{{ url('images/image.png') }}" alt="背景" />
                        </button>
                    </div>
                    <div>
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
                    <div>
                        <button id="tone-window-button"><canvas></canvas></button>
                    </div>
                    <div>
                        <button class="palette-button active" data-color="#000000"></button>
                        <button class="palette-button" data-color="#ffffff"></button>
                        <button class="palette-button" data-color="#ff0000"></button>
                        <button class="palette-button" data-color="#00ffff"></button>
                        <button class="palette-button" data-color="#00ff00"></button>
                        <button class="palette-button" data-color="#ff00ff"></button>
                        <button class="palette-button" data-color="#0000ff"></button>
                        <button class="palette-button" data-color="#ffff00"></button>
                        <button class="palette-button" data-color="transparent"></button>
                    </div>
                </div>
                <div class="left-shadow"></div>
                <div class="right-shadow"></div>
                <div class="canvas-container">
                    <canvas id="background-canvas"></canvas>
                    <canvas id="drawing-canvas"></canvas>
                    <div id="stick-cursor">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div id="tone-window">
                <div>
                    <div id="tone-dialog" class="modal-dialog">
                        <div>
                            <button class="tone-button" data-tone="black"><canvas></canvas></button>
                            <button class="tone-button" data-tone="dotBold"><canvas></canvas></button>
                            <button class="tone-button" data-tone="slashBold"><canvas></canvas></button>
                            <button class="tone-button" data-tone="backslashBold">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="verticalBold">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="verticalMedium">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="verticalLight">
                                <canvas></canvas>
                            </button>
                        </div>
                        <div>
                            <button class="tone-button" data-tone="dotMedium"><canvas></canvas></button>
                            <button class="tone-button" data-tone="dotLight"><canvas></canvas></button>
                            <button class="tone-button" data-tone="slashLight">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="backslashLight">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="horizontalBold">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="horizontalMedium">
                                <canvas></canvas>
                            </button>
                            <button class="tone-button" data-tone="horizontalLight">
                                <canvas></canvas>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="background-window">
                <div>
                    <div id="background-dialog" class="modal-dialog"></div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
