// General
import error from '../../shared/error';

export default class StickyHeaders {
    config: SHConfig;
    onScrollHandler;
    constructor(id: string, config: SHConfig) {
        this.config = {
            triggerDistance: 50,
            classes: {
                top: 'sticky-top',
                movedDown: 'sticky-down',
                movedUp: 'sticky-up'
            },
            ...config
        };
        this.config.id = id;
        // Set object values that get overwritten from above method - so replace the undefine with default value
        if(this.config.classes.top === undefined) this.config.classes.top  = 'sticky-top';
        if(this.config.classes.movedDown === undefined) this.config.classes.movedDown  = 'sticky-down';
        if(this.config.classes.movedUp === undefined) this.config.classes.movedUp  = 'sticky-up';

        // Init
        if(!this.verify()) this.initialise(); 
    }
    initialise() {
        this.onScrollHandler = onScroll.bind(this);
        // Add scroll event
        window.addEventListener('scroll', this.onScrollHandler, true);
    }
    destroy() {
        window.removeEventListener('scroll', this.onScrollHandler, true);
    }
    verify() {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;
        // config.triggerDistance
        if(typeof this.config.triggerDistance != 'number') error(`Typeof "${typeof this.config.triggerDistance }" is not allow for "triggerDistance". It must be type "number"!`), hasError = true;
        // config.classes
        if(typeof this.config.classes.top != 'string') error(`Typeof "${typeof this.config.classes.top }" is not allow for "classes.top". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.movedDown != 'string') error(`Typeof "${typeof this.config.classes.movedDown }" is not allow for "classes.movedDown". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.movedUp != 'string') error(`Typeof "${typeof this.config.classes.movedUp }" is not allow for "classes.movedUp". It must be type "string"!`), hasError = true;
        // config.onChange
        if(this.config.onChange != undefined) if(typeof this.config.onChange != 'function') error(`Typeof "${typeof this.config.onChange }" is not allow for "onChange". It must be type "function"!`), hasError = true;

        return hasError;
    }
}

function onScroll() {
    this.scrollPos = document.body.scrollTop || document.documentElement.scrollTop;
    if(this.scrollPos > this.config.triggerDistance) {
        if(this.scrollPos > this.prevScrollPos) {
            // Sticky down
            this.state = this.config.classes.movedDown;
            this.prevScrollPos = this.scrollPos;
        }
        else {
            // Sticky up
            this.state = this.config.classes.movedUp;
            this.prevScrollPos = this.scrollPos;
        }
    } 
    else {
        // Sticky top
        this.state = this.config.classes.top;
    }

    // If the state is new - change the header classes
    if(this.prevState != this.state) {
        this.prevState = this.state;
        // Remove
        if(this.state != this.config.classes.movedDown) document.getElementById(this.config.id).classList.remove(this.config.classes.movedDown);
        if(this.state != this.config.classes.movedUp) document.getElementById(this.config.id).classList.remove(this.config.classes.movedUp);
        if(this.state != this.config.classes.top) document.getElementById(this.config.id).classList.remove(this.config.classes.top);
        // Add
        document.getElementById(this.config.id).classList.add(this.state);

        if(this.config.onChange != undefined) this.config.onChange({
            state: this.state,
            scrollPos: this.scrollPos
        });
    }
}

interface SHConfig {
    id?: string,
    triggerDistance?: number,
    classes?: {
        top?: string,
        movedDown?: string,
        movedUp?: string
    },
    onChange?: (response: {
        state: string,
        scrollPos: number
    }) => void
};