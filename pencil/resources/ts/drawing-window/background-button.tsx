import { React, AttributeMap } from '../virtual-element';
import VirtualElement from '../virtual-element';

interface Props extends AttributeMap {
    src: string;
    alt: string;
}

export default class extends VirtualElement<HTMLButtonElement, Props> {
    onClick: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLButtonElement | null, props: Props) {
        super(element || 'button', props);

        const click = () => {
            this.onClick(image);
        };
        const image = <img src={this.props.src} alt={this.props.alt} onClick={click} />;

        this.element.appendChild(image);
    }
}
