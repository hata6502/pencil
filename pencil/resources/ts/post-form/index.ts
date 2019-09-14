import VirtualElement, { createElement, createVirtualElement, appendChildren } from 'velement';
import PreviewCanvas, { PreviewCanvasProps } from './preview-canvas';
import Textarea, { TextareaProps } from './textarea';

export default class extends VirtualElement<HTMLFormElement> {
    public onPreviewClick: () => void = (): void => {};
    private previewCanvas: PreviewCanvas;
    private preview: HTMLInputElement;
    private text: HTMLInputElement;
    private submitButton: HTMLInputElement;
    private lengthSpan: HTMLSpanElement;

    public constructor(element: HTMLFormElement | null) {
        super(element || 'form');

        appendChildren(
            this.element,
            (this.previewCanvas = createVirtualElement<PreviewCanvas, PreviewCanvasProps>(PreviewCanvas, {
                onClick: (): void => {
                    this.onPreviewClick();
                }
            })),
            (this.preview = createElement('input', {
                name: 'preview',
                type: 'hidden'
            })),
            createVirtualElement<Textarea, TextareaProps>(
                Textarea,
                {
                    onInput: this.changeStatus
                },
                '#HoodPencil'
            ),
            (this.lengthSpan = createElement('span', {
                style: `
                        display: block;
                    `
            })),
            (this.text = createElement('input', {
                name: 'text',
                type: 'hidden'
            })),
            (this.submitButton = createElement('input', {
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

    private changeStatus = (valid: boolean, weightedLength: number, text: string): void => {
        this.submitButton.disabled = !valid;
        this.lengthSpan.innerText = `${weightedLength} / 280`;
        this.text.value = text;
    };
}
