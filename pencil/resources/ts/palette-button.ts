export default class {
    private element: HTMLButtonElement;

    constructor(element: HTMLButtonElement, onpick: (color: string) => void) {
        this.element = element;

        const color = this.element.dataset.color;
        if (color === undefined) {
            throw "Couldn't get data-color attribute. ";
        }

        this.element.style.backgroundColor = color;
        this.element.onclick = () => {
            onpick(color);
        };
    }

    activate(): void {
        this.element.classList.add('active');
    }

    inactivate(): void {
        this.element.classList.remove('active');
    }
}
