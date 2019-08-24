import { createElement } from '../virtual-element';
import VirtualElement from '../virtual-element';

export default class extends VirtualElement<HTMLButtonElement, BackGroundButtonProps> {
    onClick: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLButtonElement | null, props: BackGroundButtonProps) {
        super(element || 'button', props);

        const click = () => {
            this.onClick(image);
        };
        const image = createElement<HTMLImageElement>('img', {
            src: this.props.src,
            alt: this.props.alt,
            onclick: click
        });

        this.element.appendChild(image);
    }
}
