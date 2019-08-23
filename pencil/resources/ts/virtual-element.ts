type Element = /*VirtualElement<HTMLElement> |*/ keyof HTMLElementTagNameMap;
type Attribute = string | (() => any);

// 疑似 React
export class React {
    static createElement(type: Element, attributes: { [name: string]: Attribute } | null) {
        const element = document.createElement(type);

        if (attributes !== null) {
            for (const name in attributes) {
                const value = attributes[name];

                if (typeof value === 'string') {
                    element.setAttribute(name, value);
                } else {
                    (element as any)[name] = value;
                }
            }
        }

        return element;
    }
}

export default class<T extends HTMLElement> {
    protected element: T;

    constructor(element: T) {
        this.element = element;
    }
}
