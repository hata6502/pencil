import VirtualElement, { createElement, appendChildren } from '../../virtual-element';

export interface ButtonProps {
    src: string;
    alt: string;
    isActive?: boolean;
    onClick?: (image: HTMLImageElement) => void;
}

export default class extends VirtualElement<HTMLButtonElement> {
    onClick: (image: HTMLImageElement) => void = () => { };

    constructor(element: HTMLButtonElement | null, props: ButtonProps) {
        super(element || 'button');

        if (props.isActive) {
            this.element.classList.add('active');
        }
        if (props.onClick) {
            this.onClick = props.onClick;
        }

        this.element.classList.add('background-button');

        let image: HTMLImageElement;
        this.element.onclick = () => {
            this.onClick(image);
        };

        appendChildren(
            this.element,
            (image = createElement<HTMLImageElement>('img', {
                src: props.src,
                alt: props.alt
            }))
        );
    }
}
