var scrollDone = false;

export function handleWheelEvent(e) {
    e.preventDefault();
    let timeout;
    if(!scrollDone) {   
        scrollDone = true;
        clearTimeout(timeout);
        if(e.deltaY < 0) this.controlEventCallback('leftUp');
        else this.controlEventCallback('rightDown');
        timeout = setTimeout(() => {
            scrollDone = false;
        }, 500);
    }
};