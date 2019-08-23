import { React } from '../virtual-element';
import VirtualElement from '../virtual-element';

interface Props {
    src: string;
    alt: string;
}

export default class A extends VirtualElement<HTMLButtonElement> {
    onClick: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLButtonElement, props: Props) {
        super(element);

        const click = () => {
            this.onClick(image);
        };
        const image = <img src={props.src} alt={props.alt} onClick={click} />;

        this.element.appendChild(image);
    }
}
