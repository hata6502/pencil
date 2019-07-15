export default class {
    private element: HTMLButtonElement
    constructor(element: HTMLButtonElement, onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any) {
        this.element = element
        this.element.onclick = onclick
    }

    setDisabled(disabled: boolean) {
        this.element.disabled = disabled
    }
}
