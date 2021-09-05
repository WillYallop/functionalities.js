// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

// Specific
import './style/main.scss';
import { touchEventsInitiate, touchEventsDestroy } from './handler/touch-events';
import { moveLeftOrUp, moveRightOrDown } from './handler/movement';

// Type definitions - only import facing ones
enum ConfigDirection { vertical = 'vertical', horizontal = 'horizontal' };
type ConfigDirectionType = 'vertical' | 'horizontal';

enum SlideDirection { rightDown = 'rightDown', leftUp = 'leftUp' };
type SlideDirectionType = 'rightDown' | 'leftUp';

interface Config {
    id?: string,
    perPage?: 'auto' | number,
    direction?: ConfigDirectionType,
    autoPlay?: boolean,
    slideDirection?: SlideDirectionType,
    gap?: number,
    speed?: number,
    enableTouch?: boolean,
    classes?: {
        slider?: string,
        wrapper?: string,
        slide?: string
    },
    triggerCB?: (response: boolean) => void
};

// Slider
export default class Slider {
    config: Config;
    // Functions
    touchEventsInitiate;
    adjustSlidesHandler: () => void;
    activeSlide: number;
    sliderLoop;
    // Elements
    sliderElement: HTMLElement;
    wrapperElement: HTMLElement;
    slidesElementsArray: any; 
    constructor(config: Config) {
        this.config = {
            id: 'sliderID',
            perPage: 2,
            direction: ConfigDirection.horizontal,
            autoPlay: false,
            slideDirection: SlideDirection.rightDown,
            gap: 20,
            speed: 2000,
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
        if(this.wrapperElement) {
            this.slidesElementsArray = [];
            let slides = this.wrapperElement.querySelectorAll(`.${this.config.classes.slide}`);
            for(let i = 0; i < slides.length; i++) {
                this.slidesElementsArray.push(slides[i]);
            }
        };
        this.activeSlide = 0;
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
            this.adjustSlidesHandler = adjustSlides.bind(this);
            this.adjustSlidesHandler();
        }

        // Set events to handle interacting with the slider - mobile and mouse touch events
        if(this.config.enableTouch) {
            this.touchEventsInitiate = touchEventsInitiate.bind(this);
            this.touchEventsInitiate();
        }

        // Start slider loop
        if(this.config.autoPlay) {
            this.sliderLoop = setInterval(() => {
                this.triggerSlide(this.config.slideDirection);
            }, this.config.speed);
        }

        // Resize event creation
        this.resizeEventHandler();
    }
    triggerSlide(direction: SlideDirectionType) {
        let moveDirection;
        // Right or Down slide
        if(direction === SlideDirection.rightDown) moveDirection = moveRightOrDown;
        // Left or Up slide
        else if (direction === SlideDirection.leftUp) moveDirection = moveLeftOrUp;
        // ERROR
        else {
            error(`triggerSlide paramater must be type string and either "${SlideDirection.rightDown}"" or "${SlideDirection.leftUp}"".`);
            return;
        }

        const moveDirectionFunc: MovementType = moveDirection.bind(this);
        const moved = moveDirectionFunc();
        // If config.triggerCB
        if(this.config.triggerCB != undefined) this.config.triggerCB(moved);
    }
    refresh() {

    }
    destory() {
        // Destroy resize
        if(this.config.perPage != 'auto') {
            window.removeEventListener('resize', this.adjustSlidesHandler);
        }
        // For config.enableTouch
        if(this.config.enableTouch) touchEventsDestroy();
    }

    // Apply wrapper offset for x & y
    applyWrapperOffsetX() {
        // Set current active slide in frame
        const offsetLeft = -Math.abs(this.slidesElementsArray[this.activeSlide].offsetLeft);
        applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
    }
    applyWrapperOffsetY() {
        // Set current active slide in frame
        const offsetTop = -Math.abs(this.slidesElementsArray[this.activeSlide].offsetTop);
        applyStyle(this.wrapperElement, 'transform', `translateY(${offsetTop}px)`);
    }

    // window resize event
    resizeEventHandler() {
        // Readjust slide
        if(this.config.perPage != 'auto') {
            window.addEventListener('resize', this.adjustSlidesHandler);
        }
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
        // config.autoPlay
        if(typeof this.config.autoPlay != 'boolean') error(`Typeof "${typeof this.config.autoPlay }" is not allow for "autoPlay". It must be type "boolean"!`), hasError = true;
       
        // config.slideDirection
        if(typeof this.config.slideDirection != 'string') error(`Typeof "${typeof this.config.slideDirection }" is not allow for "slideDirection". It must be type "string"!`), hasError = true;
        else if(this.config.slideDirection != SlideDirection.rightDown && this.config.slideDirection != SlideDirection.leftUp) error(`"slideDirection" can only be equal to ${SlideDirection.rightDown} or ${SlideDirection.leftUp}!`), hasError = true;
       
       
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
        elements.slides[i].setAttribute('og-position', `${i}`);
        elements.slides[i].classList.add('functionalities-slide');
    }
}

// Adjust slides based on config.perPage so everything is translated and overflowing correctly
function adjustSlides() {
    // Set fixed defualt height for the slider 
    if(this.config.direction === ConfigDirection.vertical) applyStyle(this.sliderElement, 'height', '600px');
    // Set constants
    const [sliderWidth, sliderHeight] = [this.wrapperElement.offsetWidth, this.wrapperElement.offsetHeight];
    const toalGapColumnsSize = (this.config.perPage - 1) * this.config.gap;
    const gapAdjusted = this.slidesElementsArray.length > 1 ? toalGapColumnsSize / this.config.perPage : 0;
    // Horizonal
    if(this.config.direction === ConfigDirection.horizontal) {
        // Set wrapper gap
        applyStyle(this.wrapperElement, 'gap', `0 ${this.config.gap}px`);
        // Work out slide width
        let slideMinWidth = (sliderWidth / this.config.perPage) - gapAdjusted;
        for(let i = 0; i < this.slidesElementsArray.length; i++) {
            applyStyle(this.slidesElementsArray[i], 'width', `${slideMinWidth}px`);
            applyStyle(this.slidesElementsArray[i], 'minWidth', `${slideMinWidth}px`);
            applyStyle(this.slidesElementsArray[i], 'maxWidth', `${slideMinWidth}px`);
        }
        // Set current active slide in frame
        this.applyWrapperOffsetX();
    }
    // Vertical
    else if(this.config.direction === ConfigDirection.vertical) {
        // Set wrapper gap
        applyStyle(this.wrapperElement, 'gap', `${this.config.gap}px 0`);
        applyStyle(this.wrapperElement, 'flexDirection', `column`);
        // Work out slide height
        let slideMinHeight = (sliderHeight / this.config.perPage) - gapAdjusted;
        for(let i = 0; i < this.slidesElementsArray.length; i++) {
            applyStyle(this.slidesElementsArray[i], 'width', `100%`);
            applyStyle(this.slidesElementsArray[i], 'height', `${slideMinHeight}px`);
            applyStyle(this.slidesElementsArray[i], 'minHeight', `${slideMinHeight}px`);
            applyStyle(this.slidesElementsArray[i], 'maxHeight', `${slideMinHeight}px`);
        }
        // Set current active slide in frame
        this.applyWrapperOffsetY();
    }
}