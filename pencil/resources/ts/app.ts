import 'core-js/stable';
import * as Sentry from '@sentry/browser';

import ModalWindow from './modal-window';
import ModalDialog from './modal-dialog';
import DrawingCanvas from './drawing-canvas';
import PencilButton from './pencil-button';
import PaletteButton from './palette-button';
import HistoryButton from './history-button';
import StickCursor from './stick-cursor';
import PointerListener from './pointer-listener';
import TextInput from './text-input';
import PreviewCanvas from './preview-canvas';
import * as Settings from './settings';

Sentry.init({ dsn: 'https://19e4397c2e5c47279823b887f7c74444@sentry.io/1509084' });

const drawingWindow = new ModalWindow(<HTMLDivElement>document.getElementById('drawing-window'));
drawingWindow.ondisplay = () => {
    drawingCanvas.isDisplay = true;
    toneWindow.display();
};
drawingWindow.onhide = () => {
    drawingCanvas.isDisplay = false;
    previewCanvas.setDrawing(drawingCanvas.getDrawing());
};

new ModalDialog(<HTMLDivElement>document.getElementById('drawing-dialog'));

const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'));
drawingCanvas.onchangehistory = (index, length) => {
    undoButton.setDisabled(index <= 0);
    redoButton.setDisabled(index >= length - 1);
};

let pencilButtons: PencilButton[] = [];
Array.prototype.forEach.call(
    document.getElementsByClassName('pencil-button'),
    (pencilButtonElement: HTMLButtonElement) => {
        const pencilButton = new PencilButton(pencilButtonElement, () => {
            pencilButtons.forEach((pencilButton: PencilButton) => {
                pencilButton.inactivate();
            });

            pencilButton.activate();
            drawingCanvas.brush = pencilButton.getBrush();

            textInput.inactivate();
            drawingCanvas.mode = 'pencil';
        });

        pencilButtons.push(pencilButton);
    }
);

let paletteButtons: PaletteButton[] = [];
Array.prototype.forEach.call(
    document.getElementsByClassName('palette-button'),
    (paletteButtonElement: HTMLButtonElement) => {
        const paletteButton = new PaletteButton(paletteButtonElement, (color: string) => {
            paletteButtons.forEach((paletteButton: PaletteButton) => {
                paletteButton.inactivate();
            });

            paletteButton.activate();
            drawingCanvas.color = color;
        });

        paletteButtons.push(paletteButton);
    }
);

const undoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('undo-button'), () => {
    drawingCanvas.undo();
});

const redoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('redo-button'), () => {
    drawingCanvas.redo();
});

const stickCursor = new StickCursor(<HTMLDivElement>document.getElementById('stick-cursor'));
stickCursor.onmove = () => {
    drawingCanvas.movePath(Math.floor(stickCursor.x), Math.floor(stickCursor.y));
};
stickCursor.onend = () => {
    drawingCanvas.finishPath();
};

const pointerListener = new PointerListener();
pointerListener.onstart = () => {
    stickCursor.hide();
};
pointerListener.onmove = (screenX, screenY) => {
    // ポインターのスクリーン座標を drawingCanvas との相対座標に変換します。
    const canvasPosition = drawingCanvas.getScreenPosition();
    const canvasX = Math.floor((screenX - 2 - canvasPosition.x) / Settings.CANVAS_ZOOM);
    const canvasY = Math.floor((screenY - 2 - canvasPosition.y) / Settings.CANVAS_ZOOM);

    drawingCanvas.movePath(canvasX, canvasY);
};
pointerListener.onend = () => {
    drawingCanvas.finishPath();
};

const textInput = new TextInput(<HTMLInputElement>document.getElementById('text-input'));
textInput.onactive = text => {
    drawingCanvas.text = text;
    drawingCanvas.mode = 'text';
};

const toneWindow = new ModalWindow(<HTMLDivElement>document.getElementById('tone-window'));
toneWindow.ondisplay = () => {
    drawingCanvas.isDisplay = false;
};
toneWindow.onhide = () => {
    drawingCanvas.isDisplay = true;
};

new ModalDialog(<HTMLDivElement>document.getElementById('tone-dialog'));

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'), () => {
    drawingWindow.display();
});
