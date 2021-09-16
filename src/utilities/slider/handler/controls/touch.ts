var prevPos: [number, number], newPos: [number, number], unlocked: boolean;

// Mouse and touch down/start
export function mouseDownEvent(e) {prevPos = [e.clientX, e.clientY], unlocked = true};
export function touchStartEvent(e) {prevPos = [e.changedTouches[0].screenX, e.changedTouches[0].screenY], unlocked = true};

// Mouse and touch move
export function mouseMoveEvent(e) { e.preventDefault(); this.mouseTouchMoveHandler(e.clientX, e.clientY);}
export function touchmoveEvent(e){e.preventDefault(); this.mouseTouchMoveHandler(e.changedTouches[0].screenX, e.changedTouches[0].screenY);}
export function mouseTouchMove(x: number, y: number) {
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
        this.controlEventCallback(direction);
    }
};

export function mouseTouchUp() {
    unlocked = false;
}