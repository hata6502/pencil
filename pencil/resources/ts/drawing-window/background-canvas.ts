import VirtualElement from '../virtual-element';
import * as Settings from '../settings';

export default class extends VirtualElement<HTMLCanvasElement> {
    private context: CanvasRenderingContext2D;

    constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString());
    }

    setBackground(image: HTMLImageElement) {
        const canvasWidth = Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM;
        const canvasHeight = Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM;

        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, canvasWidth, canvasHeight);

        const zoom = Math.min(canvasWidth / image.naturalWidth, canvasHeight / image.naturalHeight);

        const width = image.naturalWidth * zoom;
        const height = image.naturalHeight * zoom;

        this.context.drawImage(image, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height);
    }
}
