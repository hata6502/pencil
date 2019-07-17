export default class {
    private element: HTMLInputElement
    onactive: ((text: string) => void) | undefined = undefined

    constructor(element: HTMLInputElement) {
        this.element = element

        this.element.onfocus = this.element.oninput = () => {
            this.activate()

            if (this.onactive !== undefined) {
                this.onactive(this.element.value)
            }
        }
    }

    private activate(): void {
        this.element.classList.add('active')
    }

    inactivate(): void {
        this.element.classList.remove('active')
    }
}
