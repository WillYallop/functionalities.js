// General
import error from '../../shared/error';

// Specific
import { touchEventsInitiate, touchEventsDestroy } from './handler/touch-events';

// Type definitions - only import facing ones
enum ConfigDirection { vertical = 'vertical', horizontal = 'horizontal' };
type ConfigDirectionType = 'vertical' | 'horizontal';

enum SlideDirection { rightDown = 'rightDown', leftUp = 'leftUp' };
type SlideDirectionType = 'rightDown' | 'leftUp';

interface Config {
    id?: string,
    perPage?: 'auto' | number,
    direction?: ConfigDirectionType,
    loop?: boolean,
    autoPlay?: boolean,
    speed?: number,
    enableTouch?: boolean,
    classes?: SliderClasses,
    triggerCB?: (response: string) => void
};

interface SliderClasses {
    slider?: string,
    wrapper?: string
    slide?: string
};

// Slider
export default class Slider {
    config: Config;
    defaults: {
        id: string,
        perPage: 'auto' | number,
        direction: ConfigDirectionType,
        loop?: boolean,
        autoPlay?: boolean,
        speed?: number,
        enableTouch: boolean,
        classes: SliderClasses,
    };
    touchEventsInitiate;
    constructor(config: Config) {
        this.defaults = {
            id: 'sliderID',
            perPage: 'auto',
            direction: ConfigDirection.horizontal,
            loop: true,
            autoPlay: false,
            speed: 1000,
            enableTouch: true,
            classes: {
                slider: 'slider',
                wrapper: 'slider-wrapper',
                slide: 'slide'
            }
        }
        this.config = { ...this.defaults, ...config };
        // Init
        if(!this.verifyConfig()) this.initialise(); 
    } 
    initialise() {
        // Store the elements we'll need to interact with

        // Adjust slides based on config.perPage so everything is translated and overflowing correctly

        // Set events to handle interacting with the slider - mobile and mouse touch events
        if(this.config.enableTouch) {
            this.touchEventsInitiate = touchEventsInitiate.bind(this);
            this.touchEventsInitiate();
        }
    }
    triggerSlide(direction: SlideDirectionType) {
        // Right or Down slide
        if(direction === SlideDirection.rightDown) {
            console.log('Right or Down')

            // If config.triggerCB
            if(this.config.triggerCB != undefined) this.config.triggerCB('1. ');
        }
        // Left or Up slide
        else if (direction === SlideDirection.leftUp) {
            console.log('Left or Up');
            
            // If config.triggerCB
            if(this.config.triggerCB != undefined) this.config.triggerCB('1. ');
        }
        else error(`triggerSlide paramater must be type string and either "${SlideDirection.rightDown}"" or "${SlideDirection.leftUp}"".`) // ERROR
    }
    refresh() {

    }
    destory() {
        // For config.enableTouch
        if(this.config.enableTouch) touchEventsDestroy();
    }

    // Verify config values for non typescript implementation
    verifyConfig():boolean {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;
        // config.perPage
        if(typeof this.config.perPage != 'number') if(this.config.perPage != 'auto') error(`Typeof "${typeof this.config.perPage }" is not allow for "perPage". It must be type "number".`), hasError = true;
        // config.direction
        if(typeof this.config.direction != 'string') error(`Typeof "${typeof this.config.direction }" is not allow for "direction". It must be type "string".`), hasError = true;
        else if(this.config.direction != ConfigDirection.vertical && this.config.direction != ConfigDirection.horizontal) error(`"direction" can only be equal to ${ConfigDirection.vertical} or ${ConfigDirection.horizontal}.`), hasError = true;
        // config.loop
        if(typeof this.config.loop != 'boolean') error(`Typeof "${typeof this.config.loop }" is not allow for "loop". It must be type "boolean".`), hasError = true;
        // config.autoPlay
        if(typeof this.config.autoPlay != 'boolean') error(`Typeof "${typeof this.config.autoPlay }" is not allow for "autoPlay". It must be type "boolean".`), hasError = true;
        // config.speed
        if(typeof this.config.speed != 'boolean') error(`Typeof "${typeof this.config.speed }" is not allow for "speed". It must be type "boolean".`), hasError = true;
        // config.enableTouch
        if(typeof this.config.enableTouch != 'boolean') error(`Typeof "${typeof this.config.enableTouch }" is not allow for "enableTouch". It must be type "boolean".`), hasError = true;
        // config.classes
        if(typeof this.config.classes.slider != 'string') error(`Typeof "${typeof this.config.classes.slider }" is not allow for "classes.slider". It must be type "string".`), hasError = true;
        if(typeof this.config.classes.wrapper != 'string') error(`Typeof "${typeof this.config.classes.wrapper }" is not allow for "classes.wrapper". It must be type "string".`), hasError = true;
        if(typeof this.config.classes.slide != 'string') error(`Typeof "${typeof this.config.classes.slide }" is not allow for "classes.slide". It must be type "string".`), hasError = true;
        // config.triggerCB
        if(typeof this.config.triggerCB != 'function') error(`Typeof "${typeof this.config.triggerCB }" is not allow for "triggerCB". It must be type "function".`), hasError = true;

        return hasError;
    }
}