import VirtualElement from '@blue-hood/velement';

export default class extends VirtualElement<HTMLButtonElement> {
    onClick: () => void = () => {};

    constructor(element: HTMLButtonElement) {
        super(element);
        this.element.onclick = () => {
            this.onClick();
        };
    }

    setDisabled(disabled: boolean) {
        this.element.disabled = disabled;
    }
}
