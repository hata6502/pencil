
@extends('html')

@section('meta')
  @include('meta', [
    'title' => 'お絵かきのツイート',
    'description' => 'お絵かきをツイートします。',
  ])
@endsection

@section('content')
  <div class="article article-draw">
    <h2>お絵かきのツイート</h2>
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
                    <button class="palette-button" style="background-color: #ff0000; "></button>
                    <button class="palette-button" style="background-color: #00ff00; "></button>
                    <button class="palette-button" style="background-color: #ffff00; "></button>
                    <button class="palette-button" style="background-color: #0000ff; "></button>
                    <button class="palette-button" style="background-color: #ff00ff; "></button>
                    <button class="palette-button" style="background-color: #00ffff; "></button>
                    <button class="palette-button" style="background-color: #ffffff; "></button>

                    <button id="redo-button" class="history-button" disabled><img src="/images/redo.png"></button>
                    <button id="undo-button" class="history-button" disabled><img src="/images/undo.png"></button>
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
                    <button class="pencil-button" data-brush="light"><img src="/images/pencil-light.png"></button>
                    <button class="pencil-button active" data-brush="medium"><img src="/images/pencil-medium.png"></button>
                    <button class="pencil-button" data-brush="bold"><img src="/images/pencil-bold.png"></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
@endsection