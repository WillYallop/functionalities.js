function moveLeftOrUp() {
    let lingerBellow: number = this.config.perPage - 1;
    let linger: boolean;
    if(this.activeSlide + lingerBellow - 1 < 0) {
        console.log('last item')
        this.activeSlide = this.slidesElementsArray.length - this.config.perPage;
        linger = false;
    }
    else if(this.activeSlide + lingerBellow > lingerBellow) {
        console.log('go down');
        this.activeSlide--;
        linger = false;
    } 
    else {
        console.log('linger')
        this.activeSlide--;
        linger = true;
    }

    if(this.config.direction === 'horizontal') {
        if(!linger) this.applyWrapperOffsetX();
        return 'left';
    }
    else {
        if(!linger) this.applyWrapperOffsetY();
        return 'up'
    }
}

function  moveRightOrDown() {
    let linger: boolean;
    if(this.activeSlide + 1 >= this.slidesElementsArray.length) {
        this.activeSlide = 0;
        linger = false;
    }
    else if(this.activeSlide + 1 >= this.slidesElementsArray.length - (this.config.perPage - 1)) {
        this.activeSlide++;
        linger = true;
    }
    else {
        this.activeSlide++;
        linger = false;
    }

    if(this.config.direction === 'horizontal') {
        if(!linger) this.applyWrapperOffsetX(false);
        return 'right';
    }
    else {
        if(!linger) this.applyWrapperOffsetY();
        return 'down'
    }
}

export { moveLeftOrUp, moveRightOrDown };