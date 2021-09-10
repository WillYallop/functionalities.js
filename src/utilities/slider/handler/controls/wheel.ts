var triggerSlideCb: triggerSlideCbType;
var scrollDone = false;

// Internal
const handleWheelEvent = (e) => {
    e.preventDefault();
    if(!scrollDone) {   
        scrollDone = true;
        if(e.deltaY < 0) triggerSlideCb('leftUp');
        else triggerSlideCb('rightDown');
        setTimeout(() => {
            scrollDone = false;
        }, 500);
    }
};

// External
export function wheelEventsInitiate(tSCb: triggerSlideCbType) {
    triggerSlideCb = tSCb;
    this.sliderElement.addEventListener('wheel', handleWheelEvent, true);
}
export function wheelEventsDestroy(sliderElement: HTMLElement) {
    sliderElement.removeEventListener('wheel', handleWheelEvent, true);
}