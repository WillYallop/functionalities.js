// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

// Specific
import './style/main.scss';
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
    gap?: number,
    speed?: number,
    enableTouch?: boolean,
    classes?: {
        slider?: string,
        wrapper?: string,
        slide?: string
    },
    triggerCB?: (response: string) => void
};

// Slider
export default class Slider {
    config: Config;
    touchEventsInitiate;
    // Elements
    sliderElement: HTMLElement;
    wrapperElement: HTMLElement;
    slidesElementsArray: NodeListOf<HTMLElement>;
    constructor(config: Config) {
        this.config = {
            id: 'sliderID',
            perPage: 2,
            direction: ConfigDirection.horizontal,
            loop: true,
            autoPlay: false,
            gap: 20,
            speed: 1000,
            enableTouch: true,
            classes: {
                slider: 'slider',
                wrapper: 'slider-wrapper',
                slide: 'slide'
            },
            ...config
        }
        // Store the elements we'll need to interact with
        this.sliderElement = document.getElementById(this.config.id);
        this.wrapperElement = this.sliderElement.querySelector(`.${this.config.classes.wrapper}`);
        if(this.wrapperElement) this.slidesElementsArray = this.wrapperElement.querySelectorAll(`.${this.config.classes.slide}`);
        // Init
        if(!this.verify()) this.initialise(); 
    } 
    initialise() {
        // Add fixed classes to apply basic style to the slider
        applyBasicStyles({
            slider: this.sliderElement,
            wrapper: this.wrapperElement,
            slides: this.slidesElementsArray
        })

        // Adjust slides based on config.perPage so everything is translated and overflowing correctly
        if(this.config.perPage != 'auto') {
            adjustSlides({
                perPage: this.config.perPage,
                direction: this.config.direction,
                gap: this.config.gap,
                slider: this.sliderElement,
                wrapper: this.wrapperElement,
                slides: this.slidesElementsArray
            })
        }


        // Set events to handle interacting with the slider - mobile and mouse touch events
        if(this.config.enableTouch) {
            this.touchEventsInitiate = touchEventsInitiate.bind(this);
            this.touchEventsInitiate();
        }


        // TEMP
        // console.log(this);
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

    // Verify values for non typescript implementation
    verify():boolean {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;
        // config.perPage
        if(typeof this.config.perPage != 'number') if(this.config.perPage != 'auto') error(`Typeof "${typeof this.config.perPage }" is not allow for "perPage". It must be type "number"!`), hasError = true;
        // config.direction
        if(typeof this.config.direction != 'string') error(`Typeof "${typeof this.config.direction }" is not allow for "direction". It must be type "string"!`), hasError = true;
        else if(this.config.direction != ConfigDirection.vertical && this.config.direction != ConfigDirection.horizontal) error(`"direction" can only be equal to ${ConfigDirection.vertical} or ${ConfigDirection.horizontal}!`), hasError = true;
        // config.loop
        if(typeof this.config.loop != 'boolean') error(`Typeof "${typeof this.config.loop }" is not allow for "loop". It must be type "boolean"!`), hasError = true;
        // config.autoPlay
        if(typeof this.config.autoPlay != 'boolean') error(`Typeof "${typeof this.config.autoPlay }" is not allow for "autoPlay". It must be type "boolean"!`), hasError = true;
        // config.speed
        if(typeof this.config.speed != 'number') error(`Typeof "${typeof this.config.speed }" is not allow for "speed". It must be type "number"!`), hasError = true;
        // config.gap
        if(typeof this.config.gap != 'number') error(`Typeof "${typeof this.config.gap }" is not allow for "gap". It must be type "number"!`), hasError = true;
        // config.enableTouch
        if(typeof this.config.enableTouch != 'boolean') error(`Typeof "${typeof this.config.enableTouch }" is not allow for "enableTouch". It must be type "boolean"!`), hasError = true;
        // config.classes
        if(typeof this.config.classes.slider != 'string') error(`Typeof "${typeof this.config.classes.slider }" is not allow for "classes.slider". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.wrapper != 'string') error(`Typeof "${typeof this.config.classes.wrapper }" is not allow for "classes.wrapper". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.slide != 'string') error(`Typeof "${typeof this.config.classes.slide }" is not allow for "classes.slide". It must be type "string"!`), hasError = true;
        // config.triggerCB
        if(typeof this.config.triggerCB != 'function') error(`Typeof "${typeof this.config.triggerCB }" is not allow for "triggerCB". It must be type "function"!`), hasError = true;

        // Verify Elements
        if(!this.sliderElement) error(`Cannot find slider element of ID: "${this.config.id}"!`), hasError = true;
        if(!this.wrapperElement) error(`Cannot find slider wrapper element of Class: "${this.config.classes.wrapper}"!`), hasError = true;
        if(!this.slidesElementsArray) error(`Cannot find slides for slider with ID: "${this.config.id}"! This might be beacuse your "${this.config.classes.wrapper}" is undefined!`), hasError = true;
        else if(!this.slidesElementsArray.length) error(`You currently have 0 slides for the slider with ID: "${this.config.id}"!`), hasError = true;

        return hasError;
    }
}


// Add fixed classes to apply basic style to the slider
const applyBasicStyles = (elements: ApplyBasicStyles) => {
    elements.slider.classList.add('functionalities-slider');
    elements.wrapper.classList.add('functionalities-wrapper');
    for(let i = 0; i < elements.slides.length; i++) {
        elements.slides[i].classList.add('functionalities-slide');
    }
}

// Adjust slides based on config.perPage so everything is translated and overflowing correctly
const adjustSlides = (data: AdjustSlides) => {
    // Set fixed defualt height for the slider 
    if(data.direction === ConfigDirection.vertical) applyStyle(data.slider, 'height', '600px');
    // Set constants
    const [sliderWidth, sliderHeight] = [data.wrapper.offsetWidth, data.wrapper.offsetHeight];
    const toalGapColumnsSize = (data.perPage - 1) * data.gap;
    const gapAdjusted = data.slides.length > 1 ? toalGapColumnsSize / data.perPage : 0;
    // Horizonal
    if(data.direction === ConfigDirection.horizontal) {
        // Set wrapper gap
        applyStyle(data.wrapper, 'gap', `0 ${data.gap}px`);
        // Work out slide width
        let slideMinWidth = (sliderWidth / data.perPage) - gapAdjusted;
        for(let i = 0; i < data.slides.length; i++) {
            applyStyle(data.slides[i], 'width', `${slideMinWidth}px`);
            applyStyle(data.slides[i], 'minWidth', `${slideMinWidth}px`);
            applyStyle(data.slides[i], 'maxWidth', `${slideMinWidth}px`);
        }
    }
    // Vertical
    else if(data.direction === ConfigDirection.vertical) {
        // Set wrapper gap
        applyStyle(data.wrapper, 'gap', `${data.gap}px 0`);
        applyStyle(data.wrapper, 'flexDirection', `column`);
        // Work out slide height
        let slideMinHeight = (sliderHeight / data.perPage) - gapAdjusted;
        for(let i = 0; i < data.slides.length; i++) {
            applyStyle(data.slides[i], 'width', `100%`);
            applyStyle(data.slides[i], 'height', `${slideMinHeight}px`);
            applyStyle(data.slides[i], 'minHeight', `${slideMinHeight}px`);
            applyStyle(data.slides[i], 'maxHeight', `${slideMinHeight}px`);
        }
    }
}