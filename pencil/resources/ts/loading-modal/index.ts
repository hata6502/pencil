import VirtualElement, { createElement, createVirtualElement, appendChildren } from 'virtual-element';
import modalWindow from '../modal-window';

class LoadingModal extends modalWindow {
    public constructor(element: HTMLDivElement) {
        super(element);

        appendChildren(this.element, createElement<HTMLSpanElement>('span', null));
    }
}

const element = document.createElement('div');
document.body.appendChild(element);
export default new LoadingModal(element);
