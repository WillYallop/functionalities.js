<img src="https://github.com/WillYallop/functionalities.js/raw/master/images/sliders.jpeg" style="width: 100%; margin-bottom: 20px;">

## Utility: Sliders
> released

Funcitonalities Sliders is a lightweight and very flexible slider utility. It has a lot of config so you can get it setup how you like, and we only serve the bare minimum of CSS so you can incorporate it into your design however you like. This is not the final build, but is in a very usable state. 

### Features

- Supports vertical and horizontal sliders.
- Can choose between slider types: loop, infinite and fade.
- Can programatically slide in both directions.
- Can programatically slide to a specific slide.
- Supports touch/mouse drag, arrow keys and scroll wheel to navigate.
- Can configure how many slides you want visible at once, or do that in your css with perPage: auto.
- Has callback functions for before and after slide.
- Has callback function for slide click events.

### Example

Here is a basic exmaple of how to set up a slider. Feel free to conifgure it how you like, find out more about the config bellow.

```html
<div id="sliderExample" class="slider">
    <div class="slide-wrapper">

        <div class="slide">
            <p>Slide 1</p>
        </div>
        <div class="slide">
            <p>Slide 2</p>
        </div>
        <div class="slide">
            <p>Slide 3</p>
        </div>

    </div>
</div>
```

```javascript
import { Slider } from 'functionalities';

const sliderInstance = new Slider('sliderExample', {
    perPage: 3,
    autoPlay: true,
    gap: 10,
    slideDirection: 'rightDown',
    type: 'infinite',
    direction: 'horizontal',
    beforeSlide: (data) => {
        console.log('before', data);
    },
    afterSlide: (data) => {
        console.log('after', data);
    }
});
```

### Config - Types

```typescript
interface Config {
    perPage?: 'auto' | number,
    direction?: 'vertical' | 'horizontal',
    autoPlay?: boolean,
    slideDirection?: 'rightDown' | 'leftUp',
    gap?: number,
    speed?: number,
    type?: 'loop' | 'infinite' | 'fade',
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
```

### Config - Breakdown

Refer to the config types above to see what values can be used for each config key.

| Key      | Description |
| ----------- | ----------- |
| perPage      | Specify how many slides you would like to fit within the width of the slider.  |
| direction   | Specify the direction you want the slider to orient in. This can be used to create both vertical and horizontal sliders.  |
| autoPlay | Specify if you want the slider to auto play at set intervals. |
| slideDirection | Specify the direction you want the slider to slide in. This is only used if autoPlay is true. |
| gap | Specify how large of a gap you want inbetween your slides. This is in pixels. |
| speed | Specify the delay between the autoPlay sliding through your slides. This is in ms. |
| type | Specify how you want slides to behave when sliding. Either reset once reaching the end (loop), infinite or fade. |

| Key: controls | Description |
| ----------- | ----------- |
| touch | Specify if you want mouse and touch navigation turned on for the slider. |
| arrows | Specify if you want arrow key navigation turned on for the slider. In the future this will support custom keys being passed down in the config. |
| wheel | Specify if you want wheel navigation turned on for the slider. |

| Key: classes | Description |
| ----------- | ----------- |
| slider | Specify the class you want to use to target your slider. This is what your would add in your markup to the slider element. |
| wrapper | Specify the class you want to use to target the slider wrapper. |
| slide | Specify the class you want to use for each slide. |

| Callbacks | Description |
| ----------- | ----------- |
| beforeSlide | Specify a callback function for beforeSlide. As the name suggests: this fires before the slider slides. Refer to the config types above for the response data. |
| afterSlide | Specify a callback function for afterSlide. As the name suggests: theis fires after the slider slides. Refer to the config types above for the repsonse data. |
| clickEvent | Specify a callback function for clickEvent. This function is added as a click event on each slide and can be destroyed calling the destroy function. |

### Functions

| Functions | Required Paramaters | Returns | Description |
| ----------- | ----------- | ----------- | ----------- |
| triggerSlide | string: 'rightDown' or 'leftUp' | void |  As it sounds: calling this will trigger the slider to slide in the direction you specify. This function also fires the beforeSlide and afterSlide callbacks, which you can learn more about in the seciton above. |
| toSlide | number: (index of the slide) | void | Calling this function will navigate to the slide index that is passed to it. This can be used to in your pagination implementation. This function will fire the beforeSlide and afterSlide callbacks, which you can learn more about in the seciton above. |
| pause | N/A | promise |  Calling this function, if you have autoPlay in the config enabled: will pause the slider for automatically sliding. |
| start | N/A | promise |  Calling this function, if you have autoPlay in the config enabled: will start the slider so it can automatically slide. This obviously only works if the slider has been paused previously, else will return an error. |
| destory | N/A | void | Calling this function will destroy all eventListeners for this slider. If you are using this in a spa, its probably best to call this if navigating away from its page. |


### Limitations / Future Features / Notes

> features
- [Feature]: Config will be added to support adding more keys to the controls keys navigation option.
- [Examples]: A documentation site is in the works, which will contain a variety of exmaples on different configurations.

> notes
- [Note]: When using the ```config.type: 'fade'``` a default height will be set to the slider component with the class ```fixed-height```. This is because the fade type makes the slides absolute to the wrapper so they can be overlayed on top of each other, and so needs a defined height to work. This should be overwritten to your liking.
- [Note]: When using the ```config.direction: 'vertical'``` a default height will be set tot he slider component with the class ```fixed-height```. This sldier type needs a defined height. This should be overwritten to your liking.

> limitations
- [Limitations]: As designed, this doesnt come with any pagination or arrow navigation prebuilt blocks, so we dont interfere with your sites design. We supply the functions you will need to add these.