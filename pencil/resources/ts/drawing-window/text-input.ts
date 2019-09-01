import VirtualElement from 'virtual-element';

export default class extends VirtualElement<HTMLInputElement> {
    onActive: (text: string) => void = () => {};

    constructor(element: HTMLInputElement) {
        super(element);

        this.element.onfocus = this.element.oninput = () => {
            this.activate();
            this.onActive(this.element.value);
        };
    }

    private activate(): void {
        this.element.classList.add('active');
    }

    inactivate(): void {
        this.element.classList.remove('active');
    }
}
