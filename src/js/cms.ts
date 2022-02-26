// Component Manipulation System
// A simple Component system.

const afterRenderedQueue = [];

export interface ComponentObject {
    source: string;
    afterRender?: Function;
}

export function useComponent(component: ComponentObject) {
    if(component.afterRender) afterRenderedQueue.push(component.afterRender);
    return component.source;
}

export function render(el: HTMLElement, html: string) {
    el.innerHTML = html;
    afterRenderedQueue.forEach(i => i?.());
    afterRenderedQueue.splice(0, afterRenderedQueue.length);
}