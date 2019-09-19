import { createElement, appendChildren } from '@blue-hood/velement';
import modalWindow from '../modal-window';
import * as Settings from '../settings';

class LoadingModal extends modalWindow {
    public constructor(element: HTMLDivElement) {
        super(element);

        this.isHideOnClick = false;

        appendChildren(
            this.element,
            createElement<HTMLDivElement>(
                'div',
                null,
                createElement<HTMLDivElement>(
                    'div',
                    {
                        style: `
                        display: inline-block;
                        background-color: white;
                    `
                    },
                    createElement<HTMLImageElement>('img', {
                        src: Settings.SPINNER_URL,
                        alt: '読み込み中',
                        style: 'vertical-align: text-bottom;'
                    })
                )
            )
        );
    }
}

const element = document.createElement('div');
document.body.appendChild(element);
export default new LoadingModal(element);
