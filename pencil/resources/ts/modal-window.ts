let displayCount = 0;

export default class {
    ondisplay: (() => void) | undefined = undefined;
    onhide: (() => void) | undefined = undefined;
    private element: HTMLDivElement;

    constructor(element: HTMLDivElement) {
        this.element = element;

        element.onclick = e => {
            this.hide();
            e.stopPropagation();
        };
    }

    display() {
        this.element.style.display = 'table';

        if (this.ondisplay !== undefined) {
            this.ondisplay();
        }

        document.body.classList.add('noscroll');
        displayCount++;
    }

    hide() {
        this.element.style.display = 'none';

        if (this.onhide !== undefined) {
            this.onhide();
        }

        if (--displayCount <= 0) {
            document.body.classList.remove('noscroll');
        }
    }
}
