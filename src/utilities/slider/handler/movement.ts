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

function  moveRightOrDown() {
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

export { moveLeftOrUp, moveRightOrDown };