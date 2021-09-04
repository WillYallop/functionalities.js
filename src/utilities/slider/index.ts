// General
import error from '../../shared/error';

// Specific
import { touchEventsInitiate, touchEventsDestroy } from './handler/touch-events';

export default class Slider {
    config: Config;
    defaults: {
        id: string,
        perPage: 'auto' | number,
        direction: ConfigDirectionType,
        enableTouch: boolean,
    };
    adjustSlides;
    touchEventsInitiate;
    constructor(config: Config) {
        this.defaults = {
            id: 'sliderID',
            perPage: 'auto',
            direction: ConfigDirection.horizontal,
            enableTouch: true
        }
        this.config = { ...this.defaults, ...config };
        // Init
        this.initialise();
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
}

// Type definitions

enum ConfigDirection { vertical = 'vertical', horizontal = 'horizontal' };
type ConfigDirectionType = 'vertical' | 'horizontal';

enum SlideDirection { rightDown = 'rightDown', leftUp = 'leftUp' };
type SlideDirectionType = 'rightDown' | 'leftUp';

interface Config {
    id?: string,
    perPage?: 'auto' | number,
    direction?: ConfigDirectionType,
    enableTouch?: boolean,
    classes?: SliderClasses,
    triggerCB?: (response: string) => void
};

interface SliderClasses {
    slider?: string,
    wrapper?: string
    slide?: string
}