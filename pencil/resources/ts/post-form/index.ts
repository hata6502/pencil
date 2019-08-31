import VirtualElement, { createElement, createVirtualElement, appendChildren } from '../virtual-element';
import PreviewCanvas, { PreviewCanvasProps } from './preview-canvas';

export default class extends VirtualElement<HTMLFormElement> {
    public onPreviewClick: () => void = (): void => {};
    private previewCanvas: PreviewCanvas;

    public constructor(element: HTMLFormElement | null) {
        super(element || 'form');

        appendChildren(
            this.element,
            (this.previewCanvas = createVirtualElement<PreviewCanvas, PreviewCanvasProps>(PreviewCanvas, {
                onClick: (): void => {
                    this.onPreviewClick();
                }
            })),
            createElement<HTMLInputElement>('input', {
                name: 'preview',
                type: 'hidden'
            }),
            createElement<HTMLInputElement>('input', {
                type: 'submit',
                value: 'ツイート'
            })
        );
    }

    public setPreview(ndd: string, background: HTMLImageElement): void {
        this.previewCanvas.setPreview(ndd, background);
    }
}
