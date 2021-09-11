import applyStyle from '../../../shared/apply-style';

// Loop
function loopLeftOrUp() {
    this.wrapperElement.prepend(this.slidesElementsArray[this.slidesElementsArray.length - 1])
    this.slidesElementsArray.unshift(this.slidesElementsArray.pop());

    this.wrapperElement.classList.remove('wrapper-transition');

    // Do transition first
    if(this.config.direction === 'horizontal') {
        let offsetLeft = -Math.abs(this.slidesElementsArray[1].offsetLeft);
        applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
        this.activeSlide = parseInt(this.slidesElementsArray[0].getAttribute('og-position'));
        
        setTimeout(() => {
            this.wrapperElement.classList.add('wrapper-transition');
            applyStyle(this.wrapperElement, 'transform', `translateX(0px)`);
        });

        return 'left';
    }
    else {
        let offsetTop = -Math.abs(this.slidesElementsArray[1].offsetTop);
        applyStyle(this.wrapperElement, 'transform', `translateY(${offsetTop}px)`);
        this.activeSlide = parseInt(this.slidesElementsArray[0].getAttribute('og-position'));
        
        setTimeout(() => {
            this.wrapperElement.classList.add('wrapper-transition');
            applyStyle(this.wrapperElement, 'transform', `translateY(0px)`);
        });

        return 'up'
    }
}
function loopRightOrDown() {
    this.wrapperElement.classList.add('wrapper-transition');
    // Do transition first
    if(this.config.direction === 'horizontal') {
        let offsetLeft = -Math.abs(this.slidesElementsArray[1].offsetLeft);
        applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
        this.activeSlide = parseInt(this.slidesElementsArray[1].getAttribute('og-position'));
    }
    else {
        let offsetTop = -Math.abs(this.slidesElementsArray[1].offsetTop);
        applyStyle(this.wrapperElement, 'transform', `translateY(${offsetTop}px)`);
        this.activeSlide = parseInt(this.slidesElementsArray[1].getAttribute('og-position'));
    }

    setTimeout(() => {
        this.wrapperElement.classList.remove('wrapper-transition');
        this.wrapperElement.append(this.slidesElementsArray[0])
        this.slidesElementsArray.push(this.slidesElementsArray.shift());
        applyStyle(this.wrapperElement, 'transform', `translateX(0) translateY(0)`);
    }, 300);

    // Return
    if(this.config.direction === 'horizontal') return 'right';
    else return 'down'
}


// Standard
function moveLeftOrUp() {
    let lingerBellow: number = this.config.perPage - 1;
    if(this.activeSlide - 1 < 0) this.activeSlide = this.slidesElementsArray.length - 1;
    else this.activeSlide--;

    // Work out the slide we should linger on to stop the slider only showing one slide if at the end
    let slideToIndex: number;
    if(this.activeSlide + lingerBellow >= this.slidesElementsArray.length - 1) slideToIndex =  this.slidesElementsArray.length - lingerBellow - 1;
    else slideToIndex = this.activeSlide;

    if(this.config.direction === 'horizontal') {
        this.applyWrapperOffsetX(slideToIndex);
        return 'left';
    }
    else {
        this.applyWrapperOffsetY(slideToIndex);
        return 'up'
    }
}
function moveRightOrDown() {
    let lingerAbove: number = this.slidesElementsArray.length - 1 - (this.config.perPage - 1);
    if(this.activeSlide + 1 >= this.slidesElementsArray.length) this.activeSlide = 0;
    else this.activeSlide++;

    // Work out the slide we should linger on to stop the slider only showing one slide if at the end
    let slideToIndex: number;
    if(this.activeSlide >= lingerAbove) slideToIndex = lingerAbove;
    else slideToIndex = this.activeSlide;

    if(this.config.direction === 'horizontal') {
        this.applyWrapperOffsetX(slideToIndex);
        return 'right';
    }
    else {
        this.applyWrapperOffsetY(slideToIndex);
        return 'down'
    }
}


export { moveLeftOrUp, moveRightOrDown, loopLeftOrUp, loopRightOrDown };