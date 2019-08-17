import VirtualElement from '../virtual-element';

export default class extends VirtualElement<HTMLInputElement> {
    onLoad: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLInputElement) {
        super(element);

        this.element.onchange = () => {
            if (this.element.files !== null) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    if (reader.error !== null) {
                        throw reader.error;
                    }
                    if (typeof reader.result != 'string') {
                        throw 'Unexpected result type. ';
                    }

                    const image = new Image();
                    image.src = reader.result;
                    image.onload = () => {
                        this.onLoad(image);
                    };
                };
                reader.readAsDataURL(this.element.files[0]);
            }
        };
    }

    click(): void {
        this.element.click();
    }
}
