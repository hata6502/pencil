export default class {
    constructor(element: HTMLButtonElement, onclick: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
        element.onclick = onclick
    }
}
