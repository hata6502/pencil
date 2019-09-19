import VirtualElement, { createElement, appendChildren } from '@blue-hood/velement';

export interface ButtonProps {
    src: string;
    alt: string;
    isActive?: boolean;
    onClick?: (image: HTMLImageElement) => void;
}

export default class extends VirtualElement<HTMLButtonElement> {
    public onClick: (image: HTMLImageElement) => void = (): void => {};

    public constructor(element: HTMLButtonElement | null, props: ButtonProps) {
        super(element || 'button');

        if (props.isActive) {
            this.element.classList.add('active');
        }
        if (props.onClick) {
            this.onClick = props.onClick;
        }

        this.element.classList.add('background-button');

        let image: HTMLImageElement;
        this.element.onclick = (): void => {
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
