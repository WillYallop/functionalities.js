const keyEvents = [
    { key: 37, direction: 'leftUp' },
    { key: 38, direction: 'leftUp' },
    { key: 39, direction: 'rightDown' },
    { key: 40, direction: 'rightDown' }
];

export function handleKeyEvent(e) {
    let key = e.keyCode;
    let findKey = keyEvents.find( x => x.key === key );
    if(findKey) {   
        console.log(findKey.direction )
        if(findKey.direction === 'rightDown') this.controlEventCallback('rightDown');
        else if(findKey.direction === 'leftUp') this.controlEventCallback('leftUp');
    }
}