import VirtualElement from 'velement';

let displayCount = 0;

export default class extends VirtualElement<HTMLDivElement> {
    public onDisplay: () => void = (): void => {};
    public onHide: () => void = (): void => {};
    protected isHideOnClick: boolean = true;

    public constructor(element: HTMLDivElement) {
        super(element);

        this.element.classList.add('modal-window');

        this.element.onclick = (e): void => {
            if (this.isHideOnClick) {
                this.hide();
            }

            e.stopPropagation();
        };
    }

    public display(): void {
        if (this.element.style.display != 'table') {
            this.element.style.display = 'table';
            this.onDisplay();
            document.body.classList.add('noscroll');
            displayCount++;
        }
    }

    public hide(): void {
        if (this.element.style.display == 'table') {
            this.element.style.display = 'none';
            this.onHide();
            if (--displayCount <= 0) {
                document.body.classList.remove('noscroll');
            }
        }
    }
}
