import VirtualElement from 'virtual-element';

export default class extends VirtualElement<HTMLDivElement> {
    constructor(element: HTMLDivElement) {
        super(element);

        this.element.onclick = e => {
            e.stopPropagation();
        };
    }
}
