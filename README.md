<img src="./screenshot.jpeg" style="width: 100%; margin-bottom: 20px;">

# Functionalities.js
> Still under heavy development

If you are looking for a library that gives you styled, prebuilt components you are in the wrong place!

Functionalities is a utility library for the frontend developers to help speed up development, and not impeed your websites design. It aims to offer solutions for all the common components such as sliders, forms, accordions and more, that you build in your frontend applications over and over again, but with one important fact: they only contain necessary CSS and core functions so if need be you can add to the utilities however you like.

## Current Utilities
- Slider [stable - beta]
- Form/Input Validation [coming soon]
- Accordions [coming soon]
- Animations [coming soon]
- Sticky Header [coming soon]

<br>

## Utility: Sliders
> stable - beta

Funcitonalities Sliders is a lightweight and very flexible slider utility. It has a lot of config so you can get it setup how you like, and we only serve the bare minimum of CSS so you can incorporate it into your design however you like. This is not the final build, but is in a very usable state. 

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
    loop: true,
    direction: 'horizontal',
    beforeSlide: (data) => {
        console.log('before', data);
    },
    afterSlide: (data) => {
        console.log('after', data);
    }
});
```

### Features

- Supports vertical and horizontal sliders.
- Can programatically slide in both directions.
- Supports touch/mouse drag, arrow keys and scroll wheel to navigate.
- Supports infinite loop and a standard slide effect.
- Can configure how many slides you want visible at once, or do that in your css with perPage: auto.
- Has callback functions for before and after slide.

### Config - Types

```typescript
interface Config {
    perPage?: 'auto' | number,
    direction?: 'vertical' | 'horizontal',
    autoPlay?: boolean,
    slideDirection?: 'rightDown' | 'leftUp',
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
| loop | Specify if you want the slides to loop once they reach the end, or if you want the slider to reset once it reaches the end. |

| Key: controls | Description |
| ----------- | ----------- |
| touch | Specify if you want mouse and touch navigation turned on for the slider. |
| arrows | Specify if you want arrow key navigation turned on for the slider. |
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


### Functions

This isnt the final list of functions, for example a toSlide function is in the works.

| Functions | Required Paramaters | Returns | Description |
| ----------- | ----------- | ----------- | ----------- |
| triggerSlide | string: 'rightDown' or 'leftUp' | void |  As it sounds: calling this will trigger the slider to slide in the direction you specify. This function also fires the beforeSlide and afterSlide callbacks, which you can learn more about in the seciton above. |
| pause | N/A | promise |  Calling this function, if you have autoPlay in the config enabled: will pause the slider for automatically sliding. |
| start | N/A | promise |  Calling this function, if you have autoPlay in the config enabled: will start the slider so it can automatically slide. This obviously only works if the slider has been paused previously, else will return an error. |
| destory | N/A | void | Calling this function will destroy all eventListeners for this slider. If you are using this in a spa, its probably best to call this if navigating away from its page. |


### Limitations / Future Features

As this utility is still new and in development, there are a couple of limitations and missing features that we plan to work on.

- [Limitation]: perPage: 'auto' currently should only be used if loop is set to true. If not when the slider gets to the end you will see some empty space to the left of it if the slide is not 100% width.
- [Feature]: a toSlide function will be added that will allow you to programatically navigate to a given slide. This can be used for your own implementation of a pagination feature.
- [Feature]: a fade effect.

<br>

## Utility: Form/Input Validation 
> coming soon

Form/Input validation will be a simple solution to validating input fields based on a specified config. 

## Utility: Accordions
> coming soon

Quickly get accordions up and running in a project. Just use our simple and felxible boiler plate, pass the parents ID into a new instance of accordions, configure it how you like or use the default config and you're done!

## Utility: Animations
> coming soon

Functionalities animations utility, makes adding animations to your elements, easier than ever. Create a new instance of animations, pass it some config where you will specify what attribute name and link the animation type you want to associate it with. Then all you have to do is add that attribute name to the elements you want it to apply on and the the utility will do the rest.

If you dont want to use any of our presets for animations, just set the animation type to false for that attribute name, and the library will add a class to those elements where you can then create your custom animation in your CSS.

## Utility: Sticky Header
> coming soon

Sticky headers is as it sounds. Just add an ID to your header, create a new instance of the sticky header utility, pass it some config or use the defaults. This utility only add functionality. No CSS! This is to ensure flexibility.

Then depending on the users scroll a handfull of classes will be added to the header. One for scrolled down, one for scrolled up and then one for when you are at the very top of the page. This will allow you to create headers that show and hide depennding on the direction the user scrolls, and that have different styles if not scrolled at all.