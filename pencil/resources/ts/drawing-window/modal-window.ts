import VirtualElement from '../virtual-element';

let displayCount = 0;

export default class extends VirtualElement<HTMLDivElement> {
    onDisplay: () => void = () => {};
    onHide: () => void = () => {};

    constructor(element: HTMLDivElement) {
        super(element);

        element.onclick = e => {
            this.hide();
            e.stopPropagation();
        };
    }

    display() {
        if (this.element.style.display != 'table') {
            this.element.style.display = 'table';
            this.onDisplay();
            document.body.classList.add('noscroll');
            displayCount++;
        }
    }

    hide() {
        if (this.element.style.display == 'table') {
            this.element.style.display = 'none';
            this.onHide();
            if (--displayCount <= 0) {
                document.body.classList.remove('noscroll');
            }
        }
    }
}
