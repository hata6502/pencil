import VirtualElement from '../virtual-element';
import { setBackground, setNormarizedDrawingData } from '../canvas-utils';
import * as Settings from '../settings';

export interface PreviewCanvasProps {
    onClick?: () => void;
}

export default class extends VirtualElement<HTMLCanvasElement> {
    public onClick: () => void = (): void => { };
    private context: CanvasRenderingContext2D;

    public constructor(element: HTMLCanvasElement | null, props: PreviewCanvasProps) {
        super(element || 'canvas');

        if (props.onClick) {
            this.onClick = props.onClick;
        }

        this.element.classList.add('preview-canvas');

        const context = this.element.getContext('2d');
        if (context === null) {
            throw "Couldn't get context. ";
        }
        this.context = context;

        this.element.style.width = Settings.CANVAS_WIDTH + 'px';
        this.element.style.height = Settings.CANVAS_HEIGHT + 'px';
        this.element.setAttribute('width', (Settings.CANVAS_WIDTH * 3).toString());
        this.element.setAttribute('height', (Settings.CANVAS_HEIGHT * 3).toString());

        const image = new Image();
        image.src = Settings.IMAGE_URL;
        image.onload = (): void => {
            this.context.drawImage(
                image,
                ((Settings.CANVAS_WIDTH - 64) * 3) / 2,
                ((Settings.CANVAS_HEIGHT - 64) * 3) / 2,
                64 * 3,
                64 * 3
            );
        };

        this.element.onclick = (): void => {
            this.onClick();
        };
    }

    public setPreview(ndd: string, background: HTMLImageElement): void {
        setBackground(this.context, background, 3);
        setNormarizedDrawingData(this.context, ndd, 3, true);
    }
}
