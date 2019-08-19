import 'core-js';
import * as Sentry from '@sentry/browser';

import ModalWindow from './drawing-window/modal-window';
import ModalDialog from './drawing-window/modal-dialog';
import DrawingCanvas from './drawing-window/drawing-canvas';
import PencilButton from './drawing-window/pencil-button';
import PaletteButton from './drawing-window/palette-button';
import HistoryButton from './drawing-window/history-button';
import StickCursor from './drawing-window/stick-cursor';
import PointerListener from './drawing-window/pointer-listener';
import TextInput from './drawing-window/text-input';
import ToneCanvas from './drawing-window/tone-canvas';
import BackgroundButton from './drawing-window/background-button';
import BackgroundFileButton from './drawing-window/background-file-button';
import BackgroundFile from './drawing-window/background-file';
import BackgroundCanvas from './drawing-window/background-canvas';
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

const toolbar = <HTMLDivElement>document.getElementById('toolbar');
toolbar.style.width = Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM + 2 + 'px';

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
    backgroundButton.onClick = image => {
        backgroundCanvas.setBackground(image);
        backgroundWindow.hide();
    };
});

const backgroundFileButton = new BackgroundFileButton(<HTMLButtonElement>(
    document.getElementById('background-file-button')
));
backgroundFileButton.onClick = () => {
    backgroundFile.click();
};

const backgroundFile = new BackgroundFile(<HTMLInputElement>document.getElementById('background-file'));
backgroundFile.onSelect = () => {
    if (!('FileReader' in window) || navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
        backgroundFileForm.submit();
    }
};
backgroundFile.onLoad = image => {
    backgroundCanvas.setBackground(image);
    backgroundWindow.hide();
};

const backgroundFileForm = <HTMLFormElement>document.getElementById('background-file-form');

const backgroundFileIframe = <HTMLIFrameElement>document.getElementById('background-file-iframe');
backgroundFileIframe.onload = () => {
    if (
        backgroundFileIframe.contentDocument === null ||
        backgroundFileIframe.contentDocument.body.textContent === null
    ) {
        throw "Couldn't get response. ";
    }

    const response: { errors?: string[]; image?: string } = JSON.parse(
        backgroundFileIframe.contentDocument.body.textContent
    );
    if (response.errors !== undefined) {
        alert(response.errors.join('\n'));
        return;
    }
    if (response.image === undefined) {
        throw "Couldn't get image. ";
    }

    const image = new Image();
    image.src = response.image;
    image.onload = () => {
        backgroundCanvas.setBackground(image);
        backgroundWindow.hide();
    };
};

const backgroundCanvas = new BackgroundCanvas(<HTMLCanvasElement>document.getElementById('background-canvas'));

const previewCanvas = new PreviewCanvas(<HTMLCanvasElement>document.getElementById('preview-canvas'));
previewCanvas.onClick = () => {
    drawingWindow.display();
};
