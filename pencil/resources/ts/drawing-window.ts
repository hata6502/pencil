export default class {
    private element: HTMLDivElement
    private ondisplay: () => void
    private onhide: () => void

    constructor(element: HTMLDivElement, ondisplay: () => void, onhide: () => void) {
        this.element = element
        this.ondisplay = ondisplay
        this.onhide = onhide

        element.onclick = () => {
            this.hide()
        }
    }

    display() {
        this.element.style.display = 'block'
        this.ondisplay()
    }

    hide() {
        this.element.style.display = 'none'
        this.onhide()
    }
}
