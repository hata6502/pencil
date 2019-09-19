import VirtualElement, { createElement, appendChildren } from '@blue-hood/velement';
import Button, { ButtonProps } from './button';
import FileButton, { FileButtonProps } from './file-button';
import File, { FileProps } from './file';
import LoadingModal from '../../loading-modal';
import * as Settings from '../../settings';

export default class extends VirtualElement<HTMLDivElement> {
    public onLoad: (image: HTMLImageElement) => void = (): void => {};
    private backgroundFile: File;
    private backgroundFileForm: HTMLFormElement;
    private backgroundFileIframe: HTMLIFrameElement;

    public constructor(element: HTMLDivElement) {
        super(element);

        this.element.onclick = (e): void => {
            e.stopPropagation();
        };

        appendChildren(
            this.element,
            createElement<Button, ButtonProps>(Button, {
                src: Settings.BACKGROUND_IMAGES.white.src,
                alt: Settings.BACKGROUND_IMAGES.white.alt,
                isActive: true,
                onClick: this.dispatchLoad
            }),
            createElement<Button, ButtonProps>(Button, {
                src: Settings.BACKGROUND_IMAGES.wide.src,
                alt: Settings.BACKGROUND_IMAGES.wide.alt,
                onClick: this.dispatchLoad
            }),
            createElement<FileButton, FileButtonProps>(FileButton, {
                onClick: (): void => {
                    this.backgroundFile.click();
                }
            }),
            (this.backgroundFileForm = createElement<HTMLFormElement>(
                'form',
                {
                    id: 'background-file-form',
                    action: Settings.BACKGROUND_FILE_ACTION_URL,
                    method: 'POST',
                    enctype: 'multipart/form-data',
                    target: 'background-file-iframe'
                },
                (this.backgroundFile = createElement<File, FileProps>(File, {
                    onSelect: (): void => {
                        LoadingModal.display();

                        if (
                            !('FileReader' in window) ||
                            navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1
                        ) {
                            this.backgroundFileForm.submit();
                        }
                    },
                    onLoad: this.dispatchLoad
                }))
            )),
            (this.backgroundFileIframe = createElement<HTMLIFrameElement>('iframe', {
                id: 'background-file-iframe',
                name: 'background-file-iframe'
            }))
        );

        // DOM 生成後に onload イベントを設定する。
        this.backgroundFileIframe.onload = this.proceedResponse;
    }

    private dispatchLoad = (image: HTMLImageElement): void => {
        this.onLoad(image);
        LoadingModal.hide();
    };

    private proceedResponse = (): void => {
        if (
            this.backgroundFileIframe.contentDocument === null ||
            this.backgroundFileIframe.contentDocument.body.textContent === null
        ) {
            LoadingModal.hide();
            throw "Couldn't get response. ";
        }

        const response: { errors?: string[]; image?: string } = JSON.parse(
            this.backgroundFileIframe.contentDocument.body.textContent
        );
        if (response.errors !== undefined) {
            alert(response.errors.join('\n'));
            LoadingModal.hide();
            return;
        }
        if (response.image === undefined) {
            LoadingModal.hide();
            throw "Couldn't get image. ";
        }

        const image = new Image();
        image.src = response.image;
        image.onload = (): void => {
            this.onLoad(image);
            LoadingModal.hide();
        };
    };
}
