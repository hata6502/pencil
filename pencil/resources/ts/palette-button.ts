export default class {
    private element: HTMLButtonElement

    constructor(element: HTMLButtonElement, onpick: (color: string) => void) {
        this.element = element

        this.element.onclick = () => {
            if (this.element.style.backgroundColor === null) {
                throw "Couldn't get background-color property. "
            }

            onpick(this.element.style.backgroundColor)
        }
    }

    activate(): void {
        this.element.classList.add('active')
    }

    inactivate(): void {
        this.element.classList.remove('active')
    }
}
