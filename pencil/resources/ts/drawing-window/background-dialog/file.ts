import VirtualElement from '@blue-hood/velement';

export interface FileProps {
    onSelect?: () => void;
    onLoad?: (image: HTMLImageElement) => void;
}

export default class extends VirtualElement<HTMLInputElement> {
    onSelect: () => void = () => {};
    onLoad: (image: HTMLImageElement) => void = () => {};

    constructor(element: HTMLInputElement | null, props: FileProps) {
        super(element || 'input');

        if (props.onSelect) {
            this.onSelect = props.onSelect;
        }
        if (props.onLoad) {
            this.onLoad = props.onLoad;
        }

        this.element.id = 'background-file';
        this.element.name = 'image';
        this.element.type = 'file';
        this.element.accept = 'image/png,image/jpeg';

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
            this.element.value = '';
        };
    }

    click(): void {
        this.element.click();
    }
}
