import VirtualElement, { createElement } from '@blue-hood/velement';
import * as Settings from '../../settings';

export interface FileButtonProps {
    onClick?: () => void;
}

export default class extends VirtualElement<HTMLButtonElement> {
    onClick: () => void = () => { };

    constructor(element: HTMLButtonElement | null, props: FileButtonProps) {
        super(element || 'button');

        if (props.onClick) {
            this.onClick = props.onClick;
        }

        this.element.id = 'background-file-button';

        this.element.onclick = () => {
            this.onClick();
        };

        this.element.appendChild(
            createElement<HTMLImageElement>('img', {
                src: Settings.BACKGROUND_IMAGES.file.src,
                alt: Settings.BACKGROUND_IMAGES.file.alt
            })
        );
    }
}
