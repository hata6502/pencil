import VirtualElement from './virtual-element';

export default class extends VirtualElement<HTMLButtonElement> {
    onClick: (src: string) => void = () => {};

    constructor(element: HTMLButtonElement) {
        super(element);

        const image = element.getElementsByTagName('img')[0];
        this.element.onclick = () => {
            this.onClick(image.src);
        };
    }
}
