interface ConstructorSignature<HElement, VElement, Props> {
    new (element: HElement | null, props: Props): VElement;
}
type ElementType<HElement, VElement, Props> =
    | ConstructorSignature<HElement, VElement, Props>
    | keyof HTMLElementTagNameMap;

export const appendChildren = (element: HTMLElement, ...children: HTMLElement[]) => {
    children.forEach(child => {
        element.appendChild(child);
    });
};

export const createElement = <
    HElement extends HTMLElement,
    VElement extends VirtualElement<HTMLElement> = VirtualElement<HTMLElement>,
    Props extends AttributeMap = {}
>(
    type: ElementType<HElement, VElement, Props>,
    attributes: Props | null,
    ...children: HTMLElement[]
): HElement => {
    let htmlElement: HElement;

    if (typeof type === 'string') {
        htmlElement = <HElement>document.createElement(type);

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
        const props = attributes || <Props>{};
        const virtualElement = new type(null, props);
        console.log(virtualElement);
        htmlElement = <HElement>virtualElement.element;
    }

    appendChildren(htmlElement, ...children);
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
