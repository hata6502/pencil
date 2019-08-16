import VirtualElement from './virtual-element';
import * as Settings from './settings';

export default class extends VirtualElement<HTMLCanvasElement> {
    onClick: () => void = () => {};
    private context: CanvasRenderingContext2D;

    constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.element.style.width = Settings.CANVAS_WIDTH + 'px';
        this.element.style.height = Settings.CANVAS_HEIGHT + 'px';
        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString());

        var image = new Image();
        image.src = Settings.IMAGE_URL;
        image.onload = () => {
            this.context.drawImage(
                image,
                (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM - 128) / 2,
                (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM - 128) / 2,
                128,
                128
            );
        };

        this.element.onclick = () => {
            this.onClick();
        };
    }

    setDrawing(drawing: ImageData): void {
        this.context.putImageData(drawing, 0, 0);
    }
}
