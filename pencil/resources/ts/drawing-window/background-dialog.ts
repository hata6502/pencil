import { createElement, createVirtualElement, appendChildren } from '../virtual-element';
import ModalDialog from './modal-dialog';
import BackGroundButton from './background-button';
import BackGroundFileButton from './background-file-button';
import BackgroundFile from './background-file';
import * as Settings from '../settings';

export default class extends ModalDialog {
    constructor(element: HTMLDivElement) {
        super(element);

        const onButtonClick = (image: HTMLImageElement) => {
            //backgroundCanvas.setBackground(image);
            //backgroundWindow.hide();
        };

        const onFileButtonClick = () => {
            backgroundFile.click();
        };

        let backgroundFile: BackgroundFile;
        let backgroundFileForm: HTMLFormElement;
        appendChildren(
            this.element,
            createVirtualElement<BackGroundButton, BackGroundButtonProps>(BackGroundButton, {
                src: Settings.BACKGROUND_IMAGES.white.src,
                alt: Settings.BACKGROUND_IMAGES.white.alt,
                isActive: true,
                onClick: onButtonClick
            }),
            createVirtualElement<BackGroundButton, BackGroundButtonProps>(BackGroundButton, {
                src: Settings.BACKGROUND_IMAGES.wide.src,
                alt: Settings.BACKGROUND_IMAGES.wide.alt,
                onClick: onButtonClick
            }),
            createVirtualElement<BackGroundFileButton, BackGroundFileButtonProps>(BackGroundFileButton, {
                onClick: onFileButtonClick
            }),
            (backgroundFileForm = createElement<HTMLFormElement>(
                'form',
                {
                    id: 'background-file-form',
                    action: Settings.BACKGROUND_FILE_ACTION_URL,
                    method: 'POST',
                    enctype: 'multipart/form-data',
                    target: 'background-file-iframe'
                },
                (backgroundFile = createVirtualElement<BackgroundFile>(
                    BackgroundFile,
                    null /*{
                        onSelect: () => {
                            if (!('FileReader' in window) || navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') != -1) {
                            backgroundFileForm.submit();
                            }
                        },
                        onLoad: image => {
                            backgroundCanvas.setBackground(image);
                            backgroundWindow.hide();
                        }
                    }*/
                ))
            )),
            createElement<HTMLIFrameElement>('iframe', {
                id: 'background-file-iframe',
                name: 'background-file-iframe'
            })
        );
    }
}
