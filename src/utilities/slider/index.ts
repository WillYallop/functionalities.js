// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

// Specific
import './style/main.scss';
import { touchEventsInitiate, touchEventsDestroy, arrowEventsInitiate, arrowEventsDestroy, wheelEventsInitiate, wheelEventsDestroy } from './handler/control-events';
import { moveLeftOrUp, moveRightOrDown, standardNavToSingle, loopLeftOrUp, loopRightOrDown, loopNavToSingle } from './handler/movement';

// Slider
export default class Slider {
    config: Config;
    // Functions
    touchEventsInitiate;
    arrowEventsInitiate;
    wheelEventsInitiate;
    adjustSlidesHandler: () => void;
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
            loop: true,
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
            this.adjustSlidesHandler = adjustSlides.bind(this);
            this.adjustSlidesHandler();
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
        // Loop transition
        // if(this.config.loop) {
        //     this.wrapperElement.addEventListener('transitionend', () => {
        //         if(this.lastDirection === SlideDirection.rightDown) {
        //             this.wrapperElement.classList.remove('wrapper-transition');
        //             this.wrapperElement.append(this.slidesElementsArray[0])
        //             this.slidesElementsArray.push(this.slidesElementsArray.shift());
        //             applyStyle(this.wrapperElement, 'transform', `translateX(0) translateY(0)`);
        //         }
        //         else if(this.lastDirection === SlideDirection.leftUp) {

        //         }
        //     });
        // }

        // Controls
        // Touch events - mobile and mouse   
        if(this.config.controls.touch) {
            this.touchEventsInitiate = touchEventsInitiate.bind(this);
            this.touchEventsInitiate((direction) => {
                this.triggerSlide(direction);
                if(this.config.autoPlay) {
                    this.pauseAutoplay = true;
                    clearTimeout(this.restartAutoPlayTimeout);
                    this.restartAutoPlayTimeout = setTimeout(() => {this.pauseAutoplay = false;}, 5000);
                }
            });
        }
        // Keyboard arrow event
        if(this.config.controls.arrows) {
            this.arrowEventsInitiate = arrowEventsInitiate.bind(this);
            this.arrowEventsInitiate((direction) => {
                this.triggerSlide(direction);
                if(this.config.autoPlay) {
                    this.pauseAutoplay = true;
                    clearTimeout(this.restartAutoPlayTimeout);
                    this.restartAutoPlayTimeout = setTimeout(() => {this.pauseAutoplay = false;}, 5000);
                }
            });
        }
        // Mouse wheel event
        if(this.config.controls.wheel) {
            this.wheelEventsInitiate = wheelEventsInitiate.bind(this);
            this.wheelEventsInitiate((direction) => {
                this.triggerSlide(direction);
                if(this.config.autoPlay) {
                    this.pauseAutoplay = true;
                    clearTimeout(this.restartAutoPlayTimeout);
                    this.restartAutoPlayTimeout = setTimeout(() => {this.pauseAutoplay = false;}, 5000);
                }
            });
        }
    }

    // Trigger slide
    triggerSlide(direction: SlideDirectionType) {
        // Check slide cooldown
        let currentDate = new Date;
        if(this.lastSlide.getTime() + 300 < currentDate.getTime()) {
            // If config.beforeSlide
            if(this.config.beforeSlide != undefined) this.config.beforeSlide({
                currentSlide: this.activeSlide,
                totalSlides: this.slidesElementsArray.length,
                lastDirection: this.lastDirection
            });

            let moveDirection;
            // Right or Down slide
            this.lastDirection = direction;
            if(direction === SlideDirection.rightDown) {
                if(!this.config.loop) moveDirection = moveRightOrDown;
                else moveDirection = moveDirection = loopRightOrDown;
            }
            // Left or Up slide
            else if (direction === SlideDirection.leftUp) {
                if(!this.config.loop) moveDirection = moveLeftOrUp;
                else moveDirection = moveDirection = loopLeftOrUp;
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
                currentSlide: this.activeSlide,
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
                    currentSlide: this.activeSlide,
                    totalSlides: this.slidesElementsArray.length,
                    lastDirection: this.lastDirection
                });

                let moveDirection;
                if(!this.config.loop) moveDirection = standardNavToSingle;
                else moveDirection = loopNavToSingle;

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
                    currentSlide: this.activeSlide,
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
    destory() {
        // Destroy resize
        if(this.config.perPage != 'auto') {
            window.removeEventListener('resize', this.adjustSlidesHandler);
        }
        // For config.enableTouch
        if(this.config.controls.touch) touchEventsDestroy(this.sliderElement);
        // Keyboard arrow event
        if(this.config.controls.arrows) arrowEventsDestroy(this.sliderElement);
        // Mouse wheel event
        if(this.config.controls.wheel) wheelEventsDestroy(this.sliderElement);
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
        // config.autoPlay
        if(typeof this.config.autoPlay != 'boolean') error(`Typeof "${typeof this.config.autoPlay }" is not allow for "autoPlay". It must be type "boolean"!`), hasError = true;
        // config.loop
        if(typeof this.config.loop != 'boolean') error(`Typeof "${typeof this.config.loop }" is not allow for "loop". It must be type "boolean"!`), hasError = true;
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
        // config.afterSlideCB
        if(typeof this.config.afterSlide != 'function') error(`Typeof "${typeof this.config.afterSlide }" is not allow for "afterSlide". It must be type "function"!`), hasError = true;
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
        if(!this.config.loop) this.applyWrapperOffsetX(this.activeSlide);
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
        if(!this.config.loop) this.applyWrapperOffsetY(this.activeSlide);
    }
}







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
    loop?: boolean,
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
        currentSlide: number,
        totalSlides: number,
        lastDirection: string
    }) => void
    afterSlide?: (response: {
        currentSlide: number,
        totalSlides: number,
        lastDirection: string
    }) => void
};