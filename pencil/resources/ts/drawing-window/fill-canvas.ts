import VirtualElement from 'velement';
import * as Settings from '../settings';

export default class FillCanvas extends VirtualElement<HTMLCanvasElement> {
    private context: CanvasRenderingContext2D;

    public constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.context.fillStyle = 'black';

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute(
            'style',
            `
      position: absolute;
      top: 1px;
      left: 1px;
      opacity: 0.5;
    `
        );
    }

    public setMask(mask: boolean[][]): void {
        this.context.clearRect(
            0,
            0,
            Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM,
            Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM
        );

        for (let y = 0; y < Settings.CANVAS_HEIGHT; y++) {
            for (let x = 0; x < Settings.CANVAS_WIDTH; x++) {
                if (!mask[y][x]) {
                    this.context.fillRect(
                        x * Settings.CANVAS_ZOOM,
                        y * Settings.CANVAS_ZOOM,
                        Settings.CANVAS_ZOOM,
                        Settings.CANVAS_ZOOM
                    );
                }
            }
        }
    }
}
