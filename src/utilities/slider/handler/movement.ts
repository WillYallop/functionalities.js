function moveLeftOrUp() {
    if(this.activeSlide - 1 < 0) this.activeSlide = this.slidesElementsArray.length - this.config.perPage;
    else this.activeSlide--;
    
    if(this.config.direction === 'horizontal') this.applyWrapperOffsetX();
    else this.applyWrapperOffsetY();
    return true;
}

function  moveRightOrDown() {
    if(this.activeSlide + 1 >= this.slidesElementsArray.length - (this.config.perPage - 1)) this.activeSlide = 0;
    else this.activeSlide++;

    if(this.config.direction === 'horizontal') this.applyWrapperOffsetX();
    else this.applyWrapperOffsetY();
    return true;
}

export { moveLeftOrUp, moveRightOrDown };