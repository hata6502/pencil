import VirtualElement from 'virtual-element';
import * as Settings from '../settings';

export default class extends VirtualElement<HTMLCanvasElement> {
    private context: CanvasRenderingContext2D;
    private tone: number[][] = Settings.TONES.black;

    constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.draw();
    }

    setTone(tone: number[][]): void {
        this.tone = tone;
        this.draw();
    }

    private draw(): void {
        this.element.setAttribute('width', (this.tone.length * 4).toString());
        this.element.setAttribute('height', (this.tone.length * 4).toString());

        this.tone.forEach((column, y) => {
            column.forEach((pattern, x) => {
                this.context.fillStyle = pattern ? 'black' : 'white';
                this.context.fillRect(x * 4, y * 4, 4, 4);
            });
        });
    }
}
