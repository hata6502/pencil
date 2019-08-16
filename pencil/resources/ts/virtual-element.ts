export default class<T extends HTMLElement> {
    element: T;

    constructor(element: T) {
        this.element = element;
    }
}
