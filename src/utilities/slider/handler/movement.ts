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



function loopNavToSingle(targetIndex: number) {
    console.clear()
    this.wrapperElement.classList.add('wrapper-transition');

    // Get the target slides index
    var targetSlideIndex;
    for(let i = 0; i < this.slidesElementsArray.length; i++) {
        let currentSlide = this.slidesElementsArray[i];
        let pos = parseInt(currentSlide.getAttribute('og-position'));
        if(pos === targetIndex) targetSlideIndex = i;
    }
    
    // Work out the direction and how many we need to travel
    let direction;

    if(targetSlideIndex > this.activeSlide) direction = 'right';
    else if (targetSlideIndex < this.activeSlide) direction = 'left';
    else direction = false;

    this.activeSlide = targetIndex;

    if(direction != false) {
        let offsetLeft = -Math.abs(this.slidesElementsArray[targetSlideIndex].offsetLeft);
        applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
    
        setTimeout(() => {
            this.wrapperElement.classList.remove('wrapper-transition');
            applyStyle(this.wrapperElement, 'transform', `translateX(0px)`);
    
            let orderArray = [];
            let start = targetIndex;
            let overflow = 0;
            for(let i = 0; i < this.slidesElementsArray.length; i++) {
                if(start < this.slidesElementsArray.length) orderArray.push(start++);
                else orderArray.push(overflow++);
            }
        
            // Set slides order based on orderArray values
            let tempArray = [];
            for(let i = 0; i < orderArray.length; i++) {
                let slide = this.slidesElementsArray.find( x => parseInt(x.getAttribute('og-position')) === orderArray[i]);
                tempArray.push(slide);
            }
            // Reorder elements
            for(let i = 0; i < tempArray.length; i++) {
                this.wrapperElement.append(tempArray[i]);
            }

            this.slidesElementsArray = tempArray;
        }, 300);
    }

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
function standardNavToSingle(targetIndex: number) {
    let index = targetIndex - 1;

    return 'left';
}

export { moveLeftOrUp, moveRightOrDown, standardNavToSingle, loopLeftOrUp, loopRightOrDown, loopNavToSingle };