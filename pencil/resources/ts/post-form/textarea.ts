import VirtualElement from 'velement';
import * as twitter from 'twitter-text';
import * as Settings from '../settings';

export interface TextareaProps {
    onInput?: (valid: boolean, weightedLength: number, text: string) => void;
}

export default class Textarea extends VirtualElement<HTMLDivElement> {
    public onInput: (valid: boolean, weightedLength: number, text: string) => void = (): void => {};

    public constructor(element: HTMLDivElement | null, props: TextareaProps) {
        super(element || 'div');

        if (props.onInput) {
            this.onInput = props.onInput;
        }

        this.element.contentEditable = 'true';
        this.element.setAttribute(
            'style',
            `
                border: 1px solid rgba(0, 0, 0, 0.1);
            `
        );

        this.element.oninput = (): void => {
            const parsedTweet = twitter.parseTweet(this.element.innerText);
            this.onInput(parsedTweet.valid, parsedTweet.weightedLength, this.element.innerText);
        };

        this.element.onfocus = (): void => {
            this.element.innerHTML = this.element.innerText.replace(/\n/g, '<br />');
        };

        this.element.onblur = (): void => {
            this.decorate();
        };

        window.addEventListener('load', (): void => {
            const parsedTweet = twitter.parseTweet(this.element.innerText);
            this.onInput(parsedTweet.valid, parsedTweet.weightedLength, this.element.innerText);
            this.decorate();
        });
    }

    private decorate(): void {
        let prevText = this.element.innerText;
        const parsedTweet = twitter.parseTweet(prevText);

        let validHtml;
        let invalidText;
        validHtml = prevText.slice(0, parsedTweet.validRangeEnd + 1).replace(/\n/g, '<br />');
        if (prevText.length > parsedTweet.validRangeEnd + 1) {
            invalidText = prevText.slice(parsedTweet.validRangeEnd + 1);
        }

        let marks: string[] = [];
        marks = marks.concat(
            twitter.extractCashtags(prevText).map((cashtag): string => {
                return `$${cashtag}`;
            })
        );
        marks = marks.concat(
            twitter.extractHashtags(prevText).map((hashtag): string => {
                return `#${hashtag}`;
            })
        );
        marks = marks.concat(
            twitter.extractMentions(prevText).map((mention): string => {
                return `@${mention}`;
            })
        );
        marks = marks.concat(
            twitter.extractUrls(prevText).map((url): string => {
                return `${url}`;
            })
        );

        if (marks.length) {
            const escapedMarks = marks.map((mark): string => {
                return mark.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            });

            validHtml = validHtml.replace(
                new RegExp(`(${escapedMarks.join('|')})`, 'g'),
                `<span style="color: ${Settings.COLOR_PRIMARY};">$1</span>`
            );
        }

        this.element.innerHTML =
            validHtml + (invalidText ? `<span style="color: ${Settings.COLOR_DANGER};">${invalidText}</span>` : '');
    }
}
