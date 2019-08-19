import VirtualElement from '../virtual-element';

export default class extends VirtualElement<HTMLInputElement> {
    onSelect: () => void = () => {};
    onLoad: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLInputElement) {
        super(element);

        this.element.onchange = () => {
            if (this.element.files !== null && this.element.files.length == 1) {
                this.onSelect();

                if ('FileReader' in window && navigator.userAgent.toLowerCase().indexOf('nintendo wiiu') == -1) {
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
            }

            // 同じファイルを選択しても onchange イベントを発火させるようにします。
            element.value = '';
        };
    }

    click(): void {
        this.element.click();
    }
}
