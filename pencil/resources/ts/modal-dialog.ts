export default class {
    constructor(element: HTMLDivElement) {
        element.onclick = e => {
            e.stopPropagation()
        }
    }
}
