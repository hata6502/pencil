import * as Settings from './settings';

export const setBackground = (context: CanvasRenderingContext2D, image: HTMLImageElement) => {
    const canvasWidth = Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM;
    const canvasHeight = Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    const zoom = Math.min(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);

    const width = image.naturalWidth * zoom;
    const height = image.naturalHeight * zoom;

    context.drawImage(image, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height);
};
