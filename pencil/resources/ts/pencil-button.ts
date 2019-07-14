export default class {
    private element: HTMLButtonElement
    constructor(element: HTMLButtonElement, onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        this.element = element
        this.element.onclick = onclick
    }

    getBrush(): string {
        const brush = this.element.dataset.brush
        if (brush === undefined) {
            throw "Couldn't get data-brush attribute. "
        }

        return brush
    }

    activate(): void {
        this.element.classList.add('active')
    }

    inactivate(): void {
        this.element.classList.remove('active')
    }
}
