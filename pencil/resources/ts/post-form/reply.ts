import VirtualElement, { createElement, appendChildren } from '@blue-hood/velement';

interface ReplyProps {
    onChange?: (id: string) => void;
}

export default class Reply extends VirtualElement<HTMLDivElement> {
    private input: HTMLInputElement;
    private container: HTMLDivElement;
    private onChange: (id: string) => void = (): void => {};

    public constructor(element: HTMLDivElement | null, props: ReplyProps) {
        super(element || 'div');

        if (props.onChange) {
            this.onChange = props.onChange;
        }

        appendChildren(
            this.element,
            createElement(
                'label',
                {
                    for: 'reply-url'
                },
                'リプライ URL (任意)'
            ),
            (this.input = createElement('input', {
                id: 'reply-url',
                style: 'border: 1px solid rgba(0, 0, 0, 0.1); width: 100%; ',
                placeholder: 'https://twitter.com/screen_name/status/0',
                onchange: this.onInputChange
            })),
            (this.container = createElement('div', null))
        );
    }

    private onInputChange = (): void => {
        const match = this.input.value.match(/(?:mobile\.)?twitter\.com\/[0-9a-zA-Z_]{1,15}\/status\/(\d+)/);
        let id = '';

        this.container.innerHTML = '';
        if (match) {
            id = match[1];
            // @ts-ignore
            // eslint-disable-next-line no-undef
            twttr.widgets.createTweet(id, this.container);
        }

        this.onChange(id);
    };
}

declare module '@blue-hood/velement' {
    function createElement(type: typeof Reply, props: ReplyProps): Reply;
}
