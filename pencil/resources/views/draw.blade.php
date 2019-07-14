
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
                  <div id="stick-cursor">
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