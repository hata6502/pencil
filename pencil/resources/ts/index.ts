//import 'core-js';
import * as Sentry from '@sentry/browser';

import PostForm from './post-form';
import ModalWindow from './modal-window';
import DrawingCanvas from './drawing-window/drawing-canvas';
import PencilButton from './drawing-window/pencil-button';
import PaletteButton from './drawing-window/palette-button';
import HistoryButton from './drawing-window/history-button';
import StickCursor from './drawing-window/stick-cursor';
import PointerListener from './drawing-window/pointer-listener';
import ToneCanvas from './drawing-window/tone-canvas';
import BackgroundDialog from './drawing-window/background-dialog';
import BackgroundCanvas from './drawing-window/background-canvas';
import FillCanvas from './drawing-window/fill-canvas';
import LoadingModal from './loading-modal';
import * as Settings from './settings';

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV == 'production') {
    Sentry.init({ dsn: Settings.SENTRY_DSN });
}

/*if ('serviceWorker' in navigator) {
    window.addEventListener('load', (): void => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}*/

if (true) {
    const postForm = new PostForm(document.getElementById('post-form') as HTMLFormElement);
    const drawingWindow = new ModalWindow(document.getElementById('drawing-window') as HTMLDivElement);
    const backgroundCanvas = new BackgroundCanvas(document.getElementById('background-canvas') as HTMLCanvasElement);
    const fillCanvas = new FillCanvas(document.getElementById('fill-canvas') as HTMLCanvasElement);
    const drawingCanvas = new DrawingCanvas(document.getElementById('drawing-canvas') as HTMLCanvasElement);
    const toolbar = document.getElementById('toolbar') as HTMLDivElement;
    const pencilButtons: PencilButton[] = [];
    let paletteButtons: PaletteButton[] = [];
    const undoButton = new HistoryButton(document.getElementById('undo-button') as HTMLButtonElement);
    const redoButton = new HistoryButton(document.getElementById('redo-button') as HTMLButtonElement);
    const clearButton = document.getElementById('clear-button') as HTMLButtonElement;
    const backgroundButton = document.getElementById('background-button') as HTMLButtonElement;
    const fillButton = document.getElementById('fill-button') as HTMLButtonElement;
    const stickCursor = new StickCursor(document.getElementById('stick-cursor') as HTMLDivElement);
    const pointerListener = new PointerListener();
    const toneWindowButton = document.getElementById('tone-window-button') as HTMLButtonElement;
    const toneWindowButttonCanvas = new ToneCanvas(toneWindowButton.getElementsByTagName('canvas')[0]);
    const toneWindow = new ModalWindow(document.getElementById('tone-window') as HTMLDivElement);
    const backgroundWindow = new ModalWindow(document.getElementById('background-window') as HTMLDivElement);
    const backgroundDialog = new BackgroundDialog(document.getElementById('background-dialog') as HTMLDivElement);
    let backgroundImage: HTMLImageElement = new Image();

    (document.getElementById('tone-dialog') as HTMLDivElement).onclick = (e): void => {
        e.stopPropagation();
    };
    (document.getElementById('drawing-dialog') as HTMLDivElement).onclick = (e): void => {
        e.stopPropagation();
    };

    postForm.onPreviewClick = (): void => {
        drawingWindow.display();
    };

    drawingWindow.onDisplay = (): void => {
        stickCursor.enable = drawingCanvas.isDisplay = true;
    };
    drawingWindow.onHide = (): void => {
        LoadingModal.display();

        setTimeout((): void => {
            stickCursor.enable = drawingCanvas.isDisplay = false;
            drawingCanvas.backup(true);
            postForm.setPreview(drawingCanvas.getNormarizedDrawingData(), backgroundImage);
            LoadingModal.hide();
        }, 16);
    };

    toolbar.style.width = Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM + 2 + 'px';

    drawingCanvas.onChangeHistory = (index, length): void => {
        undoButton.setDisabled(index <= 0);
        redoButton.setDisabled(index >= length - 1);
    };
    drawingCanvas.onChangeMask = (mask): void => {
        fillCanvas.setMask(mask);
    };

    Array.prototype.forEach.call(
        document.getElementsByClassName('pencil-button'),
        (element: HTMLButtonElement): void => {
            const pencilButton = new PencilButton(element);
            pencilButton.onClick = (): void => {
                pencilButtons.forEach((pencilButton: PencilButton): void => {
                    pencilButton.inactivate();
                });

                pencilButton.activate();
                drawingCanvas.brush = pencilButton.getBrush();
            };

            pencilButtons.push(pencilButton);
        }
    );

    fillButton.onclick = (): void => {
        fillButton.classList.toggle('active');
        drawingCanvas.mode = fillButton.classList.contains('active') ? 'fill' : 'pencil';
    };

    Array.prototype.forEach.call(
        document.getElementsByClassName('palette-button'),
        (element: HTMLButtonElement): void => {
            const paletteButton = new PaletteButton(element);
            paletteButton.onPick = (color: string): void => {
                paletteButtons.forEach((paletteButton: PaletteButton): void => {
                    paletteButton.inactivate();
                });

                paletteButton.activate();
                drawingCanvas.color = color;
            };

            paletteButtons.push(paletteButton);
        }
    );

    undoButton.onClick = (): void => {
        drawingCanvas.undo();
    };

    redoButton.onClick = (): void => {
        drawingCanvas.redo();
    };

    clearButton.onclick = (): void => {
        drawingCanvas.clear();
    };

    backgroundButton.onclick = (): void => {
        backgroundWindow.display();
    };

    stickCursor.onMove = (): void => {
        drawingCanvas.movePath(Math.floor(stickCursor.x), Math.floor(stickCursor.y));
    };
    stickCursor.onEnd = (): void => {
        drawingCanvas.finishPath();
    };

    pointerListener.onStart = (): void => {
        stickCursor.hide();
    };
    pointerListener.onMove = (screenX, screenY): void => {
        const canvasPosition = drawingCanvas.getScreenPosition();
        const canvasX = Math.floor((screenX - 2 - canvasPosition.x) / Settings.CANVAS_ZOOM);
        const canvasY = Math.floor((screenY - 2 - canvasPosition.y) / Settings.CANVAS_ZOOM);

        drawingCanvas.movePath(canvasX, canvasY);
    };
    pointerListener.onEnd = (): void => {
        drawingCanvas.finishPath();
    };

    toneWindowButton.onclick = (): void => {
        toneWindow.display();
    };

    toneWindow.onDisplay = (): void => {
        stickCursor.enable = drawingCanvas.isDisplay = false;
    };
    toneWindow.onHide = (): void => {
        stickCursor.enable = drawingCanvas.isDisplay = true;
    };

    Array.prototype.forEach.call(document.getElementsByClassName('tone-button'), (button: HTMLButtonElement): void => {
        button.onclick = (): void => {
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

    backgroundWindow.onDisplay = (): void => {
        stickCursor.enable = drawingCanvas.isDisplay = false;
    };
    backgroundWindow.onHide = (): void => {
        stickCursor.enable = drawingCanvas.isDisplay = true;
    };

    backgroundDialog.onLoad = (image): void => {
        backgroundImage = image;
        backgroundCanvas.setBackground(backgroundImage);
        backgroundWindow.hide();
    };
}
