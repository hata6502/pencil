import VirtualElement, { createElement, createVirtualElement, appendChildren } from '../virtual-element';
import PreviewCanvas, { PreviewCanvasProps } from './preview-canvas';

export default class extends VirtualElement<HTMLFormElement> {
    public onPreviewClick: () => void = (): void => {};
    private previewCanvas: PreviewCanvas;
    private preview: HTMLInputElement;
    private submitButton: HTMLInputElement;

    public constructor(element: HTMLFormElement | null) {
        super(element || 'form');

        appendChildren(
            this.element,
            (this.previewCanvas = createVirtualElement<PreviewCanvas, PreviewCanvasProps>(PreviewCanvas, {
                onClick: (): void => {
                    this.onPreviewClick();
                }
            })),
            (this.preview = createElement<HTMLInputElement>('input', {
                name: 'preview',
                type: 'hidden'
            })),
            (this.submitButton = createElement<HTMLInputElement>('input', {
                type: 'submit',
                value: 'ツイート',
                onclick: this.submit
            }))
        );
    }

    public setPreview(ndd: string, background: HTMLImageElement): void {
        this.previewCanvas.setPreview(ndd, background);
    }

    private submit = (): void => {
        this.preview.value = this.previewCanvas.toDataURL().replace('data:image/png;base64,', '');
        this.submitButton.value = '送信中';
        this.submitButton.disabled = true;
        this.element.submit();
    };
}
