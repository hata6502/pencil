import VirtualElement from '@blue-hood/velement';
import * as Settings from '../settings';
import { setBackground } from '../canvas-utils';

export default class extends VirtualElement<HTMLCanvasElement> {
    private context: CanvasRenderingContext2D;

    public constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * Settings.CANVAS_ZOOM).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * Settings.CANVAS_ZOOM).toString());
    }

    public setBackground(image: HTMLImageElement): void {
        setBackground(this.context, image, Settings.CANVAS_ZOOM);
    }
}
