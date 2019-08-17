import VirtualElement from '../virtual-element';
import * as Settings from '../settings';

export default class extends VirtualElement<HTMLButtonElement> {
    onPick: (color: string) => void = () => { };

    constructor(element: HTMLButtonElement) {
        super(element);

        const color = this.element.dataset.color;
        if (color === undefined) {
            throw "Couldn't get data-color attribute. ";
        }

        if (color != 'transparent') {
            this.element.style.backgroundColor = color;
        } else {
            this.element.style.backgroundImage = `url('${Settings.TRANSPARENT_URL}')`;
        }

        this.element.onclick = () => {
            this.onPick(color);
        };
    }

    activate(): void {
        this.element.classList.add('active');
    }

    inactivate(): void {
        this.element.classList.remove('active');
    }
}
