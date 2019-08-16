import VirtualElement from './virtual-element';

export default class extends VirtualElement<HTMLButtonElement> {
    onClick: () => void = () => {};

    constructor(element: HTMLButtonElement) {
        super(element);

        this.element.onclick = () => {
            this.onClick();
        };
    }

    getBrush(): string {
        const brush = this.element.dataset.brush;
        if (brush === undefined) {
            throw "Couldn't get data-brush attribute. ";
        }

        return brush;
    }

    activate(): void {
        this.element.classList.add('active');
    }

    inactivate(): void {
        this.element.classList.remove('active');
    }
}
