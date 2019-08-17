export default class<T extends HTMLElement> {
    protected element: T;

    constructor(element: T) {
        this.element = element;
    }
}
