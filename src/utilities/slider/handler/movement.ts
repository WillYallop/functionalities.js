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

    // Work out the direction and how many we need to travel
    let direction;

    if(targetIndex > this.activeSlide) direction = 'right';
    else if (targetIndex < this.activeSlide) direction = 'left';
    else direction = false;

    this.activeSlide = targetIndex;

    if(direction != false) {

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
    
        if(direction === 'right') {
            this.wrapperElement.classList.add('wrapper-transition');

            if(this.config.direction === 'horizontal') { 
                let offsetLeft = -Math.abs(tempArray[0].offsetLeft);
                applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
            }
            else {
                let offsetTop = -Math.abs(tempArray[0].offsetTop);
                applyStyle(this.wrapperElement, 'transform', `translateY(${offsetTop}px)`);
            }

            setTimeout(() => {
                this.wrapperElement.classList.remove('wrapper-transition');
                applyStyle(this.wrapperElement, 'transform', `translateX(0) translateY(0)`);
                // Reorder elements
                for(let i = 0; i < tempArray.length; i++) {
                    this.wrapperElement.append(tempArray[i]);
                }
            }, 300);

        }
        else if(direction === 'left'){

            // Reorder elements
            for(let i = 0; i < tempArray.length; i++) {
                this.wrapperElement.append(tempArray[i]);
            }

            this.wrapperElement.classList.remove('wrapper-transition');

            if(this.config.direction === 'horizontal') { 
                let offsetLeft = -Math.abs(tempArray[1].offsetLeft);
                applyStyle(this.wrapperElement, 'transform', `translateX(${offsetLeft}px)`);
            }
            else {
                let offsetTop = -Math.abs(tempArray[1].offsetTop);
                applyStyle(this.wrapperElement, 'transform', `translateY(${offsetTop}px)`);
            }

            setTimeout(() => {
                this.wrapperElement.classList.add('wrapper-transition');
                applyStyle(this.wrapperElement, 'transform', `translateX(0) translateY(0)`);
            });
        }
        this.slidesElementsArray = tempArray;
    }

}

// Standard
function moveLeftOrUp() {
    if(this.activeSlide - 1 < 0) this.activeSlide = this.slidesElementsArray.length - 1;
    else this.activeSlide--;

    if(this.config.direction === 'horizontal') {
        if(this.slidesElementsArray[this.activeSlide].offsetLeft <= this.wrapperElement.scrollWidth - this.sliderElement.offsetWidth) {
            // Scroll horizontal 
            this.applyWrapperOffsetX(this.activeSlide);
            return 'left';
        }
        else {
            // Stop horizontal
            // translateX should be wrapper scrollWidth minus the    target slide width and slider width difference
            let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetWidth - this.sliderElement.offsetWidth);
            sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetWidth
            let translateX = -Math.abs(this.wrapperElement.scrollWidth - sliderSlideDif);
            // console.log(translateX);
            applyStyle(this.wrapperElement, 'transform', `translateX(${translateX}px)`);
            return 'left';
        }
    }
    else {
        if(this.slidesElementsArray[this.activeSlide].offsetTop <= this.wrapperElement.scrollHeight - this.sliderElement.offsetHeight) {
            // Scroll vertical 
            this.applyWrapperOffsetY(this.activeSlide);
            return 'up'
        }
        else {
            // Stop vertical
            let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetHeight - this.sliderElement.offsetHeight);
            sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetHeight
            let translateY = -Math.abs(this.wrapperElement.scrollHeight - sliderSlideDif);
            // console.log(translateX);
            applyStyle(this.wrapperElement, 'transform', `translateY(${translateY}px)`);
            return 'up'
        }
    }






    // // leftoffset is less than the wrapper width (total slides width) - the slide container width
    // if(this.slidesElementsArray[this.activeSlide].offsetLeft <= this.wrapperElement.scrollWidth - this.sliderElement.offsetWidth) {
    //     // Scroll
    //     if(this.config.direction === 'horizontal') {
    //         this.applyWrapperOffsetX(this.activeSlide);
    //         return 'left';
    //     }
    //     else {
    //         this.applyWrapperOffsetY(this.activeSlide);
    //         return 'up'
    //     }
    // }
    // else {
    //     // STOP
    //     // translateX should be wrapper scrollWidth minus the    target slide width and slider width difference
    //     let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetWidth - this.sliderElement.offsetWidth);
    //     sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetWidth
    //     let translateX = -Math.abs(this.wrapperElement.scrollWidth - sliderSlideDif);
    //     // console.log(translateX);
    //     applyStyle(this.wrapperElement, 'transform', `translateX(${translateX}px)`);
    // }

    
    
}
function moveRightOrDown() {
    if(this.activeSlide + 1 >= this.slidesElementsArray.length) this.activeSlide = 0;
    else this.activeSlide++;


    if(this.config.direction === 'horizontal') {
        if(this.slidesElementsArray[this.activeSlide].offsetLeft <= this.wrapperElement.scrollWidth - this.sliderElement.offsetWidth) {
            // Scroll horizontal 
            this.applyWrapperOffsetX(this.activeSlide);
            return 'right';
        }
        else {
            // Stop horizontal
            // translateX should be wrapper scrollWidth minus the    target slide width and slider width difference
            let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetWidth - this.sliderElement.offsetWidth);
            sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetWidth
            let translateX = -Math.abs(this.wrapperElement.scrollWidth - sliderSlideDif);
            // console.log(translateX);
            applyStyle(this.wrapperElement, 'transform', `translateX(${translateX}px)`);
            return 'right';
        }
    }
    else {
        if(this.slidesElementsArray[this.activeSlide].offsetTop <= this.wrapperElement.scrollHeight - this.sliderElement.offsetHeight) {
            // Scroll vertical 
            this.applyWrapperOffsetY(this.activeSlide);
            return 'down'
        }
        else {
            // Stop vertical
            let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetHeight - this.sliderElement.offsetHeight);
            sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetHeight
            let translateY = -Math.abs(this.wrapperElement.scrollHeight - sliderSlideDif);
            // console.log(translateX);
            applyStyle(this.wrapperElement, 'transform', `translateY(${translateY}px)`);
            return 'down'
        }
    }
}
function standardNavToSingle(targetIndex: number) {
    // Work out the direction and how many we need to travel
    let direction;
    if(targetIndex > this.activeSlide) direction = 'right';
    else if (targetIndex < this.activeSlide) direction = 'left';
    else direction = false;

    this.activeSlide = targetIndex;
    if(direction != false) { 
        if(this.config.direction === 'horizontal') {
            if(this.slidesElementsArray[this.activeSlide].offsetLeft <= this.wrapperElement.scrollWidth - this.sliderElement.offsetWidth) {
                // Scroll horizontal 
                this.applyWrapperOffsetX(this.activeSlide);
                return 'right';
            }
            else {
                // Stop horizontal
                // translateX should be wrapper scrollWidth minus the    target slide width and slider width difference
                let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetWidth - this.sliderElement.offsetWidth);
                sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetWidth
                let translateX = -Math.abs(this.wrapperElement.scrollWidth - sliderSlideDif);
                // console.log(translateX);
                applyStyle(this.wrapperElement, 'transform', `translateX(${translateX}px)`);
                return 'right';
            }
        }
        else {
            if(this.slidesElementsArray[this.activeSlide].offsetTop <= this.wrapperElement.scrollHeight - this.sliderElement.offsetHeight) {
                // Scroll vertical 
                this.applyWrapperOffsetY(this.activeSlide);
                return 'down'
            }
            else {
                // Stop vertical
                let sliderSlideDif = Math.abs(this.slidesElementsArray[this.activeSlide].offsetHeight - this.sliderElement.offsetHeight);
                sliderSlideDif += this.slidesElementsArray[this.activeSlide].offsetHeight
                let translateY = -Math.abs(this.wrapperElement.scrollHeight - sliderSlideDif);
                // console.log(translateX);
                applyStyle(this.wrapperElement, 'transform', `translateY(${translateY}px)`);
                return 'down'
            }
        }
    }
}

// Fade
function fadeBack() {
    this.wrapperElement.classList.add('wrapper-transition');
    if(this.activeSlide - 1 < 0) this.activeSlide = this.slidesElementsArray.length - 1;
    else this.activeSlide--;

    this.wrapperElement.children[this.activeSlide].classList.remove('dont-animate');
    this.wrapperElement.children[this.activeSlide].style.opacity = 1;

    setTimeout(() => {
        for(let i = 0; i < this.wrapperElement.children.length; i++) {
            let child = this.wrapperElement.children[i];
            if(child.getAttribute('og-position') != this.activeSlide) {
                child.classList.remove('dont-animate');
                child.style.opacity = 0;
            }
        }
    }, 300);
}
function fadeForward() {
    this.wrapperElement.classList.add('wrapper-transition');
    if(this.activeSlide + 1 >= this.slidesElementsArray.length) this.activeSlide = 0;
    else this.activeSlide++;

    for(let i = 0; i < this.wrapperElement.children.length; i++) {
        let child = this.wrapperElement.children[i];
        if(this.activeSlide != 0) {
            if(child.getAttribute('og-position') == this.activeSlide) {
                child.classList.add('dont-animate');
                child.style.opacity = 1;
            }
            else {
                child.classList.remove('dont-animate');
                child.style.opacity = 0;
            }
        }
        else {
            child.classList.remove('dont-animate');
            child.style.opacity = 1;
        }
    }
}
function fadeToSingle(targetIndex: number) {
    let direction;
    if(targetIndex > this.activeSlide) direction = 'right';
    else if (targetIndex < this.activeSlide) direction = 'left';
    else direction = false;

    this.activeSlide = targetIndex;

    if(direction != false) {
        this.wrapperElement.classList.add('wrapper-transition');
        if(direction === 'right') {
            for(let i = 0; i < this.wrapperElement.children.length; i++) {
                let child = this.wrapperElement.children[i];
                if(this.activeSlide != 0) {
                    if(child.getAttribute('og-position') == this.activeSlide) {
                        child.classList.add('dont-animate');
                        child.style.opacity = 1;
                    }
                    else {
                        child.classList.remove('dont-animate');
                        child.style.opacity = 0;
                    }
                }
                else {
                    child.classList.remove('dont-animate');
                    child.style.opacity = 1;
                }
            }
        }
        else if(direction === 'left'){

            this.wrapperElement.children[this.activeSlide].classList.remove('dont-animate');
            this.wrapperElement.children[this.activeSlide].style.opacity = 1;
        
            setTimeout(() => {
                for(let i = 0; i < this.wrapperElement.children.length; i++) {
                    let child = this.wrapperElement.children[i];
                    if(child.getAttribute('og-position') != this.activeSlide) {
                        child.classList.remove('dont-animate');
                        child.style.opacity = 0;
                    }
                }
            }, 300);
        }
    }
}

export { moveLeftOrUp, moveRightOrDown, standardNavToSingle, loopLeftOrUp, loopRightOrDown, loopNavToSingle, fadeBack, fadeForward, fadeToSingle };