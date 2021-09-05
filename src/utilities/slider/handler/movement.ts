import applyStyle from '../../../shared/apply-style';


function moveLeft() {
    if(this.activeSlide - 1 < 0) this.activeSlide = this.slidesElementsArray.length - this.config.perPage;
    else this.activeSlide--;
    // Get the offsetLeft from this active element and set the transform translate offser of the wrapper to this value 
    this.applyWrapperOffset();
    return true;
}

function  moveRight() {
    if(this.activeSlide + 1 >= this.slidesElementsArray.length - (this.config.perPage - 1)) this.activeSlide = 0;
    else this.activeSlide++;
    // Get the offsetLeft from this active element and set the transform translate offser of the wrapper to this value 
    this.applyWrapperOffset();
    return true;
}

function moveUp() {

    return true;
}

function moveDown() {

    return true;
}

export { moveLeft, moveRight, moveUp, moveDown };