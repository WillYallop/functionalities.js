var prevPos: [number, number], newPos: [number, number], unlocked: boolean;

// Internal
// Mouse and touch down/start
const down = (x: number, y: number) => {prevPos = [x, y], unlocked = true};
// Mouse and touch move
const move = (event: object, x: number, y: number, cb: (direction: SlideDirectionType) => void) => {
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
        cb(direction);
    }
};

// External
export function touchEventsInitiate(triggerSlideCb: (direction: SlideDirectionType) => {}) {
    // Mouse and touch down/start
    this.sliderElement.addEventListener('mousedown', (e) => down(e.clientX, e.clientY), true);
    this.sliderElement.addEventListener('touchstart', (e) => down(e.changedTouches[0].screenX, e.changedTouches[0].screenY), true);
    // Mouse and touch move
    this.sliderElement.addEventListener('mousemove', (e) => move(e, e.clientX, e.clientY, triggerSlideCb), true);
    this.sliderElement.addEventListener('touchmove', (e) => move(e, e.changedTouches[0].screenX, e.changedTouches[0].screenY, triggerSlideCb), true);
}

export function touchEventsDestroy() {

}