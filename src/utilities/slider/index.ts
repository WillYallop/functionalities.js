// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

// Specific
import './style/main.scss';
import {  
    mouseDownEvent, touchStartEvent, mouseMoveEvent, touchmoveEvent, mouseTouchMove, mouseTouchUp, 
    handleKeyEvent, 
    handleWheelEvent 
} from './handler/control-events';
import { 
    moveLeftOrUp, moveRightOrDown, loopNavToSingle, 
    infiniteLeftOrUp, infiniteRightOrDown, infiniteNavToSingle, 
    fadeBack, fadeForward, fadeToSingle 
} from './handler/movement';

// Slider
export default class Slider {
    config: Config;
    // Touch handlers
    mouseDownEventHandler;
    touchStartEventHandler;
    mouseMoveEventHandler;
    touchmoveEventHandler;
    mouseTouchUpHandler;
    mouseTouchMoveHandler;
    // Key
    handleKeyEventHandler;
    // Scroll
    handleWheelEventHandler;
    // Functions
    arrowEventsInitiate;
    wheelEventsInitiate;
    adjustSlidesHandler: () => void;
    clickEventHandler;
    activeSlide: number;
    sliderLoop;
    lastSlide: Date;
    restartAutoPlayTimeout;
    slideDirection: SlideDirectionType;
    lastDirection: SlideDirectionType;
    translateX: number;
    autoPlayPaused: boolean;
    pauseAutoplay: boolean;
    // Elements
    sliderElement: HTMLElement;
    wrapperElement: HTMLElement;
    slidesElementsArray: any; 
    constructor(id: string, config: Config) {
        this.config = {
            perPage: 2,
            direction: ConfigDirection.horizontal,
            autoPlay: true,
            slideDirection: SlideDirection.rightDown,
            type: SliderType.infinite,
            gap: 20,
            speed: 2000,
            controls: {
                touch: true,
                arrows: true,
                wheel: true
            },
            classes: {
                slider: 'slider',
                wrapper: 'slider-wrapper',
                slide: 'slide'
            },
            ...config
        };
        this.config.id = id;
        // Set object values that get overwritten from above method - so replace the undefine with default value
        if(this.config.controls.touch === undefined) this.config.controls.touch = true;
        if(this.config.controls.arrows === undefined) this.config.controls.arrows = true;
        if(this.config.controls.wheel === undefined) this.config.controls.wheel = true;
        if(this.config.classes.slider === undefined) this.config.classes.slider  = 'slider';
        if(this.config.classes.wrapper === undefined) this.config.classes.wrapper  = 'slider-wrapper';
        if(this.config.classes.slide === undefined) this.config.classes.slide  = 'slide';

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
        this.translateX = 0;
        this.lastSlide = new Date();
        // Init
        if(!this.verify()) this.initialise(); 
    } 
    initialise() {
        // Add fixed classes to apply basic style to the slider
        applyBasicStyles({
            slider: this.sliderElement,
            wrapper: this.wrapperElement,
            slides: this.slidesElementsArray
        });

        // Adjust slides based on config.perPage so everything is translated and overflowing correctly
        if(this.config.perPage != 'auto') {
            if(this.config.type === SliderType.loop || this.config.type === SliderType.infinite) {
                this.adjustSlidesHandler = adjustSlides.bind(this);
                this.adjustSlidesHandler();
            }
            else if(this.config.type === SliderType.fade) {
                this.sliderElement.classList.add('fixed-height');
                this.adjustSlidesHandler = adjustSlidesFade.bind(this);
                this.adjustSlidesHandler();
            }
        }
        else {
            // Set fixed defualt height for the slider 
            if(this.config.direction === ConfigDirection.vertical) {
                this.sliderElement.classList.add('fixed-height');
                applyStyle(this.wrapperElement, 'flexDirection', 'column');
            };
        }

        // Set events to handle interacting with the slider - mobile and mouse touch events
        this.eventsController();

        // Start slider loop
        if(this.config.autoPlay) {
            this.sliderLoop = setInterval(() => {
                if(!this.pauseAutoplay) this.triggerSlide(this.config.slideDirection);
            }, this.config.speed);
        }

        // Resize event creation
        this.resizeEventHandler();
    }
    eventsController() {
        // Controls
        // Touch events - mobile and mouse   
        if(this.config.controls.touch) {
            // Bind functions
            this.mouseDownEventHandler = mouseDownEvent.bind(this);
            this.touchStartEventHandler = touchStartEvent.bind(this);
            this.mouseMoveEventHandler = mouseMoveEvent.bind(this);
            this.touchmoveEventHandler = touchmoveEvent.bind(this);
            this.mouseTouchUpHandler = mouseTouchUp.bind(this);
            this.mouseTouchMoveHandler = mouseTouchMove.bind(this);
            // Mouse and touch down/start
            this.sliderElement.addEventListener('mousedown', this.mouseDownEventHandler, true);
            this.sliderElement.addEventListener('touchstart', this.touchStartEventHandler, true);
            // Mouse and touch move
            this.sliderElement.addEventListener('mousemove', this.mouseMoveEventHandler, true);
            this.sliderElement.addEventListener('touchmove', this.touchmoveEventHandler, true);
            // Mouse up 
            this.sliderElement.addEventListener('mouseup', this.mouseTouchUpHandler, true);
            this.sliderElement.addEventListener('touchend', this.mouseTouchUpHandler, true);
        }
        // // Keyboard arrow event
        if(this.config.controls.arrows) {
            this.handleKeyEventHandler = handleKeyEvent.bind(this);
            this.sliderElement.setAttribute('tabindex', '0');
            this.sliderElement.addEventListener('keydown', this.handleKeyEventHandler, true);
        }
        // // Mouse wheel event
        if(this.config.controls.wheel) {
            this.handleWheelEventHandler = handleWheelEvent.bind(this);
            this.sliderElement.addEventListener('wheel', this.handleWheelEventHandler, true);
        }

        // this.config.clickEvent
        if(this.config.clickEvent != undefined) {
            this.clickEventHandler = clickEventHandler.bind(this);
            for(let i = 0; i < this.slidesElementsArray.length; i++) {
                this.slidesElementsArray[i].addEventListener('click', this.clickEventHandler, true);
            }
        }
    }
    controlEventCallback(direction) {
        this.triggerSlide(direction);
        if(this.config.autoPlay) {
            this.pauseAutoplay = true;
            clearTimeout(this.restartAutoPlayTimeout);
            this.restartAutoPlayTimeout = setTimeout(() => {this.pauseAutoplay = false;}, 5000);
        }
    }

    // Trigger slide
    triggerSlide(direction: SlideDirectionType) {

        // Check slide cooldown
        let currentDate = new Date;
        if(this.lastSlide.getTime() + 300 < currentDate.getTime()) {
            // If config.beforeSlide
            if(this.config.beforeSlide != undefined) this.config.beforeSlide({
                currentSlideIndex: this.activeSlide,
                totalSlides: this.slidesElementsArray.length,
                lastDirection: this.lastDirection
            });

            let moveDirection;
            // Right or Down slide
            this.lastDirection = direction;
            if(direction === SlideDirection.rightDown) {
                if(this.config.type === SliderType.loop) moveDirection = moveRightOrDown;
                else if(this.config.type === SliderType.infinite) moveDirection = infiniteRightOrDown;
                else if(this.config.type === SliderType.fade) moveDirection = fadeForward;
                else error(`Cannot triger slide with config.type of ${this.config.type}!`);
            }
            // Left or Up slide
            else if (direction === SlideDirection.leftUp) {
                if(this.config.type === SliderType.loop) moveDirection = moveLeftOrUp;
                else if(this.config.type === SliderType.infinite) moveDirection = infiniteLeftOrUp;
                else if(this.config.type === SliderType.fade) moveDirection = fadeBack;
                else error(`Cannot triger slide with config.type of ${this.config.type}!`);
            }
            // ERROR
            else {
                error(`triggerSlide paramater must be type string and either "${SlideDirection.rightDown}"" or "${SlideDirection.leftUp}"".`);
                return;
            }
            const moveDirectionFunc: MovementType = moveDirection.bind(this);
            moveDirectionFunc();
            this.lastSlide = new Date();

            // If config.afterSlide
            if(this.config.afterSlide != undefined) this.config.afterSlide({
                currentSlideIndex: this.activeSlide,
                totalSlides: this.slidesElementsArray.length,
                lastDirection: this.lastDirection
            });
        }
    }
    // 
    toSlide(slideIndex: number) {
        if(typeof slideIndex != 'number') {
            error(`Typeof "${ typeof slideIndex }" is not allow for the paramater on this function. It must be type "number".`);
            return;
        }

        // Verify slide number
        if(slideIndex > this.slidesElementsArray.length || slideIndex < 0) {
            error(`Cannot find slide with position of ${slideIndex}! Please make sure the slide number you are wanting to visit exists!`);
            error(`Tip: this function counts slides starting from 0!`);
        }
        else {
            // Check slide cooldown
            let currentDate = new Date;
            if(this.lastSlide.getTime() + 300 < currentDate.getTime()) {

                // If config.beforeSlide
                if(this.config.beforeSlide != undefined) this.config.beforeSlide({
                    currentSlideIndex: this.activeSlide,
                    totalSlides: this.slidesElementsArray.length,
                    lastDirection: this.lastDirection
                });

                let moveDirection;
                if(this.config.type === SliderType.loop) moveDirection = loopNavToSingle;
                else if(this.config.type === SliderType.infinite) moveDirection = infiniteNavToSingle;
                else if(this.config.type === SliderType.fade) moveDirection = fadeToSingle;
                else error(`Cannot triger slide with config.type of ${this.config.type}!`);

                const moveDirectionFunc= moveDirection.bind(this);
                moveDirectionFunc(slideIndex);
                this.lastSlide = new Date();

                if(this.config.autoPlay) {
                    this.pauseAutoplay = true;
                    clearTimeout(this.restartAutoPlayTimeout);
                    this.restartAutoPlayTimeout = setTimeout(() => {this.pauseAutoplay = false;}, 5000);
                }

                // If config.afterSlide
                if(this.config.afterSlide != undefined) this.config.afterSlide({
                    currentSlideIndex: this.activeSlide,
                    totalSlides: this.slidesElementsArray.length,
                    lastDirection: this.lastDirection
                });
            }
        }
    }
    // Stop the autoPlay slider
    pause() {
        return new Promise((resolve, reject) => {
            if(this.config.autoPlay) {
                if(!this.autoPlayPaused) {
                    clearInterval(this.sliderLoop);
                    this.autoPlayPaused = true;
                    resolve({
                        success: true,
                        msg: 'Successfully paused the slider!'
                    });
                }
                else {
                    let msg = 'The slider is already paused!'
                    error(msg);
                    reject({
                        success: false,
                        msg: msg
                    });
                };
            }
            else {
                let msg = 'You must have config.autoPlay set to "true" to be able to use this function!';
                error(msg);
                reject({
                    success: false,
                    msg: msg
                });
            }
        });
    }
    // Start the autoPlay slider
    start() {
        return new Promise((resolve, reject) => { 
            if(this.config.autoPlay) {
                if(this.autoPlayPaused) {
                    this.sliderLoop = setInterval(() => {
                        if(!this.pauseAutoplay) this.triggerSlide(this.config.slideDirection);
                    }, this.config.speed);
                    this.autoPlayPaused = false;
                    resolve({
                        success: true,
                        msg: 'Successfully started the slider!'
                    });
                }
                else {
                    let msg = 'You can only start autoPlay if you have paused it before hand!';
                    error(msg);
                    reject({
                        success: false,
                        msg: msg
                    });
                };
            } else {
                let msg = 'You must have config.autoPlay set to "true" to be able to use this function!';
                error(msg);
                reject({
                    success: false,
                    msg: msg
                });
            };
        });
    }
    // Destroy all event listeners
    destroy() {
        // Destroy resize
        if(this.config.perPage != 'auto') {
            window.removeEventListener('resize', this.adjustSlidesHandler);
        }
        // For config.enableTouch
        if(this.config.controls.touch) {
            // Mouse and touch down/start
            this.sliderElement.removeEventListener('mousedown', this.mouseDownEventHandler, true);
            this.sliderElement.removeEventListener('touchstart', this.touchStartEventHandler, true);
            // Mouse and touch move
            this.sliderElement.removeEventListener('mousemove', this.mouseMoveEventHandler, true);
            this.sliderElement.removeEventListener('touchmove', this.touchmoveEventHandler, true);
            // Mouse up 
            this.sliderElement.removeEventListener('mouseup', this.mouseTouchUpHandler, true);
            this.sliderElement.removeEventListener('touchend', this.mouseTouchUpHandler, true);
        }
        // Keyboard arrow event
        if(this.config.controls.arrows) {
            this.sliderElement.removeEventListener('keydown', this.handleKeyEventHandler, true);
        };
        // Mouse wheel event
        if(this.config.controls.wheel) {
            this.sliderElement.removeEventListener('wheel', this.handleWheelEventHandler, true);
        }

        // this.config.clickEvent
        if(this.config.clickEvent != undefined) {
            for(let i = 0; i < this.slidesElementsArray.length; i++) {
                this.slidesElementsArray[i].removeEventListener('click', this.clickEventHandler, true);
            }
        }
    }

    // Apply wrapper offset for x & y
    // Standard
    applyWrapperOffsetX(index: number) {
        // Set current active slide in frame
        const offsetLeft = -Math.abs(this.slidesElementsArray[index].offsetLeft);
        applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
    }
    applyWrapperOffsetY(index: number) {
        // Set current active slide in frame
        const offsetTop = -Math.abs(this.slidesElementsArray[index].offsetTop);
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
        // config.type
        if(typeof this.config.type != 'string') error(`Typeof "${typeof this.config.type }" is not allow for "type". It must be type "string"!`), hasError = true;
        else if(this.config.type != SliderType.loop && this.config.type != SliderType.infinite && this.config.type != SliderType.fade) error(`"type" can only be equal to ${SliderType.loop}, ${SliderType.infinite} or ${SliderType.fade}!`), hasError = true;
        // config.autoPlay
        if(typeof this.config.autoPlay != 'boolean') error(`Typeof "${typeof this.config.autoPlay }" is not allow for "autoPlay". It must be type "boolean"!`), hasError = true;
        // config.slideDirection
        if(typeof this.config.slideDirection != 'string') error(`Typeof "${typeof this.config.slideDirection }" is not allow for "slideDirection". It must be type "string"!`), hasError = true;
        else if(this.config.slideDirection != SlideDirection.rightDown && this.config.slideDirection != SlideDirection.leftUp) error(`"slideDirection" can only be equal to ${SlideDirection.rightDown} or ${SlideDirection.leftUp}!`), hasError = true;
        // config.speed
        if(typeof this.config.speed != 'number') error(`Typeof "${typeof this.config.speed }" is not allow for "speed". It must be type "number"!`), hasError = true;
        // config.gap
        if(typeof this.config.gap != 'number') error(`Typeof "${typeof this.config.gap }" is not allow for "gap". It must be type "number"!`), hasError = true;
        // config.controls
        if(typeof this.config.controls.touch != 'boolean') error(`Typeof "${typeof this.config.controls.touch }" is not allow for "controls.touch". It must be type "boolean"!`), hasError = true;
        if(typeof this.config.controls.arrows != 'boolean') error(`Typeof "${typeof this.config.controls.arrows }" is not allow for "controls.arrows". It must be type "boolean"!`), hasError = true;
        if(typeof this.config.controls.wheel != 'boolean') error(`Typeof "${typeof this.config.controls.wheel }" is not allow for "controls.wheel". It must be type "boolean"!`), hasError = true;
        // config.classes
        if(typeof this.config.classes.slider != 'string') error(`Typeof "${typeof this.config.classes.slider }" is not allow for "classes.slider". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.wrapper != 'string') error(`Typeof "${typeof this.config.classes.wrapper }" is not allow for "classes.wrapper". It must be type "string"!`), hasError = true;
        if(typeof this.config.classes.slide != 'string') error(`Typeof "${typeof this.config.classes.slide }" is not allow for "classes.slide". It must be type "string"!`), hasError = true;
        // config.beforeSlide
        if(this.config.beforeSlide != undefined) if(typeof this.config.beforeSlide != 'function') error(`Typeof "${typeof this.config.beforeSlide }" is not allow for "beforeSlide". It must be type "function"!`), hasError = true;
        // config.afterSlideCB
        if(this.config.afterSlide != undefined) if(typeof this.config.afterSlide != 'function') error(`Typeof "${typeof this.config.afterSlide }" is not allow for "afterSlide". It must be type "function"!`), hasError = true;
        // config.clickEvent
        if(this.config.clickEvent != undefined) if(typeof this.config.clickEvent != 'function') error(`Typeof "${typeof this.config.clickEvent }" is not allow for "clickEvent". It must be type "function"!`), hasError = true;
        // Verify Elements
        if(!this.sliderElement) error(`Cannot find slider element of ID: "${this.config.id}"!`), hasError = true;
        if(!this.wrapperElement) error(`Cannot find slider wrapper element of Class: "${this.config.classes.wrapper}"!`), hasError = true;
        if(!this.slidesElementsArray) error(`Cannot find slides for slider with ID: "${this.config.id}"! This might be beacuse your "${this.config.classes.wrapper}" is undefined!`), hasError = true;
        else if(!this.slidesElementsArray.length) error(`You currently have 0 slides for the slider with ID: "${this.config.id}"!`), hasError = true;

        return hasError;
    }
}

function clickEventHandler() {
    this.config.clickEvent({
        currentSlideIndex: this.activeSlide,
        totalSlides: this.slidesElementsArray.length
    });
}

// Add fixed classes to apply basic style to the slider
const applyBasicStyles = (elements: ApplyBasicStyles) => {
    elements.slider.classList.add('functionalities-slider');
    elements.wrapper.classList.add('functionalities-wrapper');
    elements.wrapper.classList.add('wrapper-transition');
    for(let i = 0; i < elements.slides.length; i++) {
        elements.slides[i].setAttribute('og-position', `${i}`);
        elements.slides[i].classList.add('functionalities-slide');
    }
}

// Adjust slides based on config.perPage so everything is translated and overflowing correctly
function adjustSlides() {
    // Set fixed defualt height for the slider 
    if(this.config.direction === ConfigDirection.vertical) {
        this.sliderElement.classList.add('fixed-height');
    };

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
        // Set current active slide in frame for non loop
        if(this.config.type === SliderType.loop) this.applyWrapperOffsetX(this.activeSlide);
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
        // Set current active slide in frame for non loop
        if(this.config.type === SliderType.loop) this.applyWrapperOffsetY(this.activeSlide);
    }
}
// Adjust slides for config.type of fade
function adjustSlidesFade() {
    applyStyle(this.wrapperElement, 'position', `relative`);
    for(let i = 0; i < this.slidesElementsArray.length; i++) {
        applyStyle(this.slidesElementsArray[i], 'position', `absolute`);
        applyStyle(this.slidesElementsArray[i], 'top', `0px`);
        applyStyle(this.slidesElementsArray[i], 'right', `0px`);
        applyStyle(this.slidesElementsArray[i], 'left', `0px`);
        applyStyle(this.slidesElementsArray[i], 'bottom', `0px`);
        applyStyle(this.slidesElementsArray[i], 'zIndex', `${this.slidesElementsArray.length - i}`);
    }
}




// Type definitions - only import facing ones
enum ConfigDirection { vertical = 'vertical', horizontal = 'horizontal' };
type ConfigDirectionType = 'vertical' | 'horizontal';

enum SlideDirection { rightDown = 'rightDown', leftUp = 'leftUp' };
type SlideDirectionType = 'rightDown' | 'leftUp';

enum SliderType { loop = 'loop', infinite = 'infinite', fade = 'fade' };
type SliderTypeType = 'loop' | 'infinite' | 'fade';

interface Config {
    id?: string,
    perPage?: 'auto' | number,
    direction?: ConfigDirectionType,
    autoPlay?: boolean,
    slideDirection?: SlideDirectionType,
    gap?: number,
    speed?: number,
    type?: SliderTypeType,
    controls?: {
        touch?: boolean,
        arrows?: boolean,
        wheel?: boolean
    },
    classes?: {
        slider?: string,
        wrapper?: string,
        slide?: string
    },
    beforeSlide?: (response: {
        currentSlideIndex: number,
        totalSlides: number,
        lastDirection: string
    }) => void
    afterSlide?: (response: {
        currentSlideIndex: number,
        totalSlides: number,
        lastDirection: string
    }) => void
    clickEvent?: (response: {
        currentSlideIndex: number,
        totalSlides: number
    }) => void
};