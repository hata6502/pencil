import 'core-js/modules/es.object.assign';
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
import ToneCanvas from './tone-canvas';
import BackgroundButton from './background-button';
import PreviewCanvas from './preview-canvas';
import * as Settings from './settings';

Sentry.init({ dsn: Settings.SENTRY_DSN });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

const drawingWindow = new ModalWindow(<HTMLDivElement>document.getElementById('drawing-window'));
drawingWindow.onDisplay = () => {
    drawingCanvas.isDisplay = true;
};
drawingWindow.onHide = () => {
    drawingCanvas.isDisplay = false;
    previewCanvas.setDrawing(drawingCanvas.getDrawing());
};

new ModalDialog(<HTMLDivElement>document.getElementById('drawing-dialog'));

const drawingCanvas = new DrawingCanvas(<HTMLCanvasElement>document.getElementById('drawing-canvas'));
drawingCanvas.onChangeHistory = (index, length) => {
    undoButton.setDisabled(index <= 0);
    redoButton.setDisabled(index >= length - 1);
};

const pencilButtons: PencilButton[] = [];
Array.prototype.forEach.call(document.getElementsByClassName('pencil-button'), (element: HTMLButtonElement) => {
    const pencilButton = new PencilButton(element);
    pencilButton.onClick = () => {
        pencilButtons.forEach((pencilButton: PencilButton) => {
            pencilButton.inactivate();
        });

        pencilButton.activate();
        drawingCanvas.brush = pencilButton.getBrush();

        textInput.inactivate();
        drawingCanvas.mode = 'pencil';
    };

    pencilButtons.push(pencilButton);
});

let paletteButtons: PaletteButton[] = [];
Array.prototype.forEach.call(document.getElementsByClassName('palette-button'), (element: HTMLButtonElement) => {
    const paletteButton = new PaletteButton(element);
    paletteButton.onPick = (color: string) => {
        paletteButtons.forEach((paletteButton: PaletteButton) => {
            paletteButton.inactivate();
        });

        paletteButton.activate();
        drawingCanvas.color = color;
    };

    paletteButtons.push(paletteButton);
});

const undoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('undo-button'));
undoButton.onClick = () => {
    drawingCanvas.undo();
};

const redoButton = new HistoryButton(<HTMLButtonElement>document.getElementById('redo-button'));
redoButton.onClick = () => {
    drawingCanvas.redo();
};

const backgroundButton = <HTMLButtonElement>document.getElementById('background-button');
backgroundButton.onclick = () => {
    backgroundWindow.display();
};

const stickCursor = new StickCursor(<HTMLDivElement>document.getElementById('stick-cursor'));
stickCursor.onMove = () => {
    drawingCanvas.movePath(Math.floor(stickCursor.x), Math.floor(stickCursor.y));
};
stickCursor.onEnd = () => {
    drawingCanvas.finishPath();
};

const pointerListener = new PointerListener();
pointerListener.onStart = () => {
    stickCursor.hide();
};
pointerListener.onMove = (screenX, screenY) => {
    // ポインターのスクリーン座標を drawingCanvas との相対座標に変換します。
    const canvasPosition = drawingCanvas.getScreenPosition();
    const canvasX = Math.floor((screenX - 2 - canvasPosition.x) / Settings.CANVAS_ZOOM);
    const canvasY = Math.floor((screenY - 2 - canvasPosition.y) / Settings.CANVAS_ZOOM);

    drawingCanvas.movePath(canvasX, canvasY);
};
pointerListener.onEnd = () => {
    drawingCanvas.finishPath();
};

const textInput = new TextInput(<HTMLInputElement>document.getElementById('text-input'));
textInput.onActive = text => {
    drawingCanvas.text = text;
    drawingCanvas.mode = 'text';
};

const toneWindowButton = <HTMLButtonElement>document.getElementById('tone-window-button');
toneWindowButton.onclick = () => {
    toneWindow.display();
};

const toneWindowButttonCanvas = new ToneCanvas(toneWindowButton.getElementsByTagName('canvas')[0]);

const toneWindow = new ModalWindow(<HTMLDivElement>document.getElementById('tone-window'));
toneWindow.onDisplay = () => {
    drawingCanvas.isDisplay = false;
};
toneWindow.onHide = () => {
    drawingCanvas.isDisplay = true;
};

new ModalDialog(<HTMLDivElement>document.getElementById('tone-dialog'));

Array.prototype.forEach.call(document.getElementsByClassName('tone-button'), (button: HTMLButtonElement) => {
    button.onclick = () => {
        if (button.dataset.tone !== undefined) {
            drawingCanvas.tone = Settings.TONES[button.dataset.tone];
            toneWindowButttonCanvas.setTone(Settings.TONES[button.dataset.tone]);
        }

        toneWindow.hide();
    };

    const toneCanvas = new ToneCanvas(button.getElementsByTagName('canvas')[0]);
    if (button.dataset.tone !== undefined) {
        toneCanvas.setTone(Settings.TONES[button.dataset.tone]);
    }
});

const backgroundWindow = new ModalWindow(<HTMLDivElement>document.getElementById('background-window'));
backgroundWindow.onDisplay = () => {
    drawingCanvas.isDisplay = false;
};
backgroundWindow.onHide = () => {
    drawingCanvas.isDisplay = true;
};

new ModalDialog(<HTMLDivElement>document.getElementById('background-dialog'));

Array.prototype.forEach.call(document.getElementsByClassName('background-button'), (element: HTMLButtonElement) => {
    const backgroundButton = new BackgroundButton(element);
    backgroundButton.onClick = src => {
        backgroundImage.src = src;
        backgroundWindow.hide();
    };
});

const backgroundImage = <HTMLImageElement>document.getElementById('background-image');

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'));
previewCanvas.onClick = () => {
    drawingWindow.display();
};
