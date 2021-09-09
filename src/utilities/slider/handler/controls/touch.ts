var prevPos: [number, number], newPos: [number, number], unlocked: boolean;
var triggerSlideCb: triggerSlideCbType;

// Internal
// Mouse and touch down/start
const mouseDownEvent = (e) => {prevPos = [e.clientX, e.clientY], unlocked = true};
const touchStartEvent = (e) => {prevPos = [e.changedTouches[0].screenX, e.changedTouches[0].screenY], unlocked = true};

// Mouse and touch move
const mouseMoveEvent = (e) => move(e.clientX, e.clientY);
const touchmoveEvent = (e) => move(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
const move = (x: number, y: number) => {
    if(unlocked) {
        unlocked = false;
        newPos = [x, y];
        let direction: SlideDirectionType;
    
        let xDif = Math.abs(newPos[0] - prevPos[0]);
        let yDif = Math.abs(newPos[1] - prevPos[1]);
    
        // Movement is horizontal
        if(xDif > yDif) {
            if(newPos[0] > prevPos[0]) direction = 'leftUp';
            else if(newPos[0] < prevPos[0]) direction = 'rightDown';
            else return;
        }
        else {
            if(newPos[1] > prevPos[1]) direction = 'leftUp';
            else if(newPos[1] < prevPos[1]) direction = 'rightDown';
            else return;
        }
        triggerSlideCb(direction);
    }
};

// External
export function touchEventsInitiate(tSCb: triggerSlideCbType) {
    triggerSlideCb = tSCb;
    // Mouse and touch down/start
    this.sliderElement.addEventListener('mousedown', mouseDownEvent, true);
    this.sliderElement.addEventListener('touchstart', touchStartEvent, true);
    // Mouse and touch move
    this.sliderElement.addEventListener('mousemove', mouseMoveEvent, true);
    this.sliderElement.addEventListener('touchmove', touchmoveEvent, true);
}

export function touchEventsDestroy(sliderElement: HTMLElement) {
    // Mouse and touch down/start
    sliderElement.removeEventListener('mousedown', mouseDownEvent, true);
    sliderElement.removeEventListener('touchstart', touchStartEvent, true);
    // Mouse and touch move
    sliderElement.removeEventListener('mousemove', mouseMoveEvent, true);
    sliderElement.removeEventListener('touchmove', touchmoveEvent, true);
}