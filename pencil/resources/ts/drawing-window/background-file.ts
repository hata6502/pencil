import VirtualElement from '../virtual-element';

export default class extends VirtualElement<HTMLInputElement> {
    onSelect: () => void = () => {};

    constructor(element: HTMLInputElement) {
        super(element);

        this.element.onchange = () => {
            if (this.element.files !== null && this.element.files.length == 1) {
                this.onSelect();
            }
        };
    }

    click(): void {
        this.element.click();
    }
}
