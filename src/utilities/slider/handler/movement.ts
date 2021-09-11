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

    // Animate on
    // Translate to the targetIndex
    // Animate off
    // Work out how many slides are before the target in the array
    // Move them to the end
    // Translate to 0 

    // Get the target slides index
    var targetSlideIndex;
    for(let i = 0; i < this.slidesElementsArray.length; i++) {
        let currentSlide = this.slidesElementsArray[i];
        let pos = parseInt(currentSlide.getAttribute('og-position'));
        if(pos === targetIndex) targetSlideIndex = i;
    }
    
    // Work out the direction and how many we need to travel
    let totalPush = Math.abs(targetSlideIndex - this.activeSlide);
    let direction;

    if(targetSlideIndex > this.activeSlide) direction = 'right';
    else if (targetSlideIndex < this.activeSlide) direction = 'left';
    else direction = false;

    this.activeSlide = targetSlideIndex;

    // 
    let offsetLeft = -Math.abs(this.slidesElementsArray[targetSlideIndex].offsetLeft);
    applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);

    // Controller
    if(direction === 'right') {
        for(let i = 0; i < totalPush; i++) {

        }
    }
    else if (direction === 'left') {
        for(let i = 0; i < totalPush; i++) {
            console.log('left')
        }
    }
    else {
        console.log('dont move');
    }


    
    if(this.config.direction === 'horizontal') {

    }
    else {

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



// function loopNavToSingle(targetIndex: number) {

//     // Animate on
//     // Translate to the targetIndex
//     // Animate off
//     // Work out how many slides are before the target in the array
//     // Move them to the end
//     // Translate to 0 

//     // let targetSlideIndex =  parseInt(this.slidesElementsArray[targetIndex].getAttribute('og-position'));
//     var targetSlideIndex;
//     for(let i = 0; i < this.slidesElementsArray.length; i++) {
//         let currentSlide = this.slidesElementsArray[i];
//         let pos = parseInt(currentSlide.getAttribute('og-position'));
//         if(pos === targetIndex) targetSlideIndex = i;
//     }
    
    

//     // Animate on
//     this.wrapperElement.classList.add('wrapper-transition');
//     // Translate to the targetIndex
//     let offsetLeft = -Math.abs(this.slidesElementsArray[targetSlideIndex].offsetLeft);
//     applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);


//     setTimeout(() => {
//         let totalPush = Math.abs(targetSlideIndex - this.activeSlide);
//         let direction;

//         if(targetSlideIndex > this.activeSlide) direction = 'right';
//         else if (targetSlideIndex < this.activeSlide) direction = 'left';
//         else direction = false;

//         this.activeSlide = targetSlideIndex;


//         if(direction === 'right') {
//             console.log(totalPush, direction);
//         }
//         else if (direction === 'left') {
//             console.log(totalPush, direction);
//         }
//         else {
//             console.log('dont move');
//         }
//     }, 300);


    
//     if(this.config.direction === 'horizontal') {

//     }
//     else {

//     }

// }