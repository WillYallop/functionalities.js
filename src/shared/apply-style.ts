export default (element: HTMLElement, property: string, value: string):void => {
    element.style[property] = value;
}