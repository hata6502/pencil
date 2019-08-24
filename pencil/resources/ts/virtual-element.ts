interface ConstructorSignature {
    new (element: HTMLElement | null, props: AttributeMap): VirtualElement<HTMLElement, AttributeMap>;
}
type ElementType = ConstructorSignature | keyof HTMLElementTagNameMap;
type Attribute = any;

export type AttributeMap = { [name: string]: Attribute };

export const appendChildren = (element: HTMLElement, children: HTMLElement[]) => {
    children.forEach(child => {
        element.appendChild(child);
    });
};

export const createElement = (
    type: ElementType,
    attributes: AttributeMap | null,
    ...children: HTMLElement[]
): HTMLElement => {
    let htmlElement;

    if (typeof type === 'string') {
        htmlElement = document.createElement(type);

        if (attributes !== null) {
            for (const name in attributes) {
                const value = attributes[name];

                if (typeof value === 'string') {
                    htmlElement.setAttribute(name, value);
                } else {
                    (htmlElement as any)[name] = value;
                }
            }
        }
    } else {
        const props = attributes || {};
        const virtualElement = new type(null, props);
        console.log(virtualElement);
        htmlElement = virtualElement.element;
    }

    appendChildren(htmlElement, children);
    return htmlElement;
};

export default class VirtualElement<Element extends HTMLElement, Props extends AttributeMap = {}> {
    element: Element;
    protected props: Props;

    constructor(element: Element | keyof HTMLElementTagNameMap, props?: Props) {
        if (typeof element === 'string') {
            this.element = <Element>document.createElement(element);
        } else {
            this.element = element;
        }

        this.props = props || <Props>{};
    }
}
