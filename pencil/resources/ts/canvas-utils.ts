import * as Settings from './settings';

export function setBackground(context: CanvasRenderingContext2D, image: HTMLImageElement, zoom: number): void {
    const canvasWidth = Settings.CANVAS_WIDTH * zoom;
    const canvasHeight = Settings.CANVAS_HEIGHT * zoom;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    const imageZoom = Math.min(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);

    const width = image.naturalWidth * imageZoom;
    const height = image.naturalHeight * imageZoom;

    context.drawImage(image, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height);
}

export function setNormarizedDrawingData(
    context: CanvasRenderingContext2D,
    ndd: string,
    zoom: number,
    isTransparent: boolean
): void {
    const [width, height, data] = ndd.split(',');

    context.globalAlpha = 1;
    let i = 0;
    for (let y = 0; y < Number(height); y++) {
        for (let x = 0; x < Number(width); x++) {
            const pixel = parseInt(data.substring(i, i + 1), 16);
            i++;

            if (pixel & 8) {
                const r = Number((pixel & 1) !== 0) * 255;
                const g = Number((pixel & 2) !== 0) * 255;
                const b = Number((pixel & 4) !== 0) * 255;

                context.fillStyle = `rgb(${r},${g},${b})`;
                context.fillRect(x * zoom, y * zoom, zoom, zoom);
            } else {
                if (!isTransparent) {
                    context.clearRect(x * zoom, y * zoom, zoom, zoom);
                }
            }
        }
    }
}
