import VirtualElement from '../virtual-element';
import * as Settings from '../settings';
import { setBackground } from '../canvas-utils';

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
        setBackground(this.context, image);
    }
}
