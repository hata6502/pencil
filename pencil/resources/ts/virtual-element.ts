export const appendChildren = (element: HTMLElement, ...children: (HTMLElement | VirtualElement)[]): void => {
    children.forEach(child => {
        element.appendChild(child instanceof HTMLElement ? child : child.element);
    });
};

export const createElement = <HElement extends HTMLElement>(
    type: keyof HTMLElementTagNameMap,
    attributes: { [name: string]: any } | null,
    ...children: (HTMLElement | VirtualElement)[]
): HElement => {
    const htmlElement = <HElement>document.createElement(type);

    for (const name in attributes) {
        (<any>htmlElement)[name] = attributes[name];
    }

    appendChildren(htmlElement, ...children);
    return htmlElement;
};

export const createVirtualElement = <VElement extends VirtualElement, Props = null>(
    type: { new (element: null, props: Props): VElement },
    props: Props,
    ...children: (HTMLElement | VirtualElement)[]
): VElement => {
    const virtualElement = new type(null, props);

    appendChildren(virtualElement.element, ...children);
    return virtualElement;
};

export default class VirtualElement<HElement extends HTMLElement = HTMLElement> {
    element: HElement;

    constructor(element: HElement | keyof HTMLElementTagNameMap) {
        if (typeof element === 'string') {
            this.element = <HElement>document.createElement(element);
        } else {
            this.element = element;
        }
    }
}
