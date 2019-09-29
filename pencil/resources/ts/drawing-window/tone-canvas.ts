import VirtualElement from '@blue-hood/velement';
import * as Settings from '../settings';

export default class extends VirtualElement<HTMLCanvasElement> {
    private context: CanvasRenderingContext2D;
    private tone: number[][] = Settings.TONES.black;

    public constructor(element: HTMLCanvasElement) {
        super(element);

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.draw();
    }

    public setTone(tone: number[][]): void {
        this.tone = tone;
        this.draw();
    }

    private draw(): void {
        this.element.setAttribute('width', (this.tone.length * 4).toString());
        this.element.setAttribute('height', (this.tone.length * 4).toString());

        this.tone.forEach((column, y): void => {
            column.forEach((pattern, x): void => {
                this.context.fillStyle = pattern ? 'black' : 'white';
                this.context.fillRect(x * 4, y * 4, 4, 4);
            });
        });
    }
}
