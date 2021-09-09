var triggerSlideCb: triggerSlideCbType;
const keyEvents = [
    { key: 37, direction: 'leftUp' },
    { key: 38, direction: 'leftUp' },
    { key: 39, direction: 'rightDown' },
    { key: 40, direction: 'rightDown' }
];

// Internal
const handleKeyEvent = (e) => {
    let key = e.keyCode;
    let findKey = keyEvents.find( x => x.key === key );
    if(findKey) {   
        if(findKey.direction === 'rightDown') triggerSlideCb('rightDown');
        else if(findKey.direction === 'leftUp') triggerSlideCb('leftUp');
    }
}

// External
export function arrowEventsInitiate(tSCb: triggerSlideCbType) {
    triggerSlideCb = tSCb;
    this.sliderElement.setAttribute('tabindex', '0');
    this.sliderElement.addEventListener('keydown', handleKeyEvent, true);
}

export function arrowEventsDestroy(sliderElement: HTMLElement) {
    sliderElement.removeEventListener('keydown', handleKeyEvent, true);
}