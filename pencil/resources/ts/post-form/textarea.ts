import VirtualElement from 'velement';
import * as twitter from 'twitter-text';

export default class extends VirtualElement<HTMLDivElement> {
    public constructor(element: HTMLDivElement | null) {
        super(element || 'div');

        this.element.contentEditable = 'true';
        this.element.setAttribute(
            'style',
            `
      border: 1px solid rgba(0, 0, 0, 0.1);
    `
        );

        this.element.oninput = (): void => {
            console.log(twitter.parseTweet(this.element.innerText));
        };
    }
}
