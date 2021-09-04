<img src="./screenshot.jpeg" style="width: 100%; margin-bottom: 20px;">

# Functionalities.js

Functionalities is a utility library for the frontend to help speed up development. It aims to offer solutions for all the common components such as sliders, forms, accordions that you build in your frontend applications over and over again.

Each utility is designed to be as flexible and barebones as possible so that they can fit into any projects easily, while giving you full control over the look and feel. 

## Current Utilities
- Sliders
- Form/Input Validation
- Accordions
- Add class when in viewport (can use for animations)

<br>

## **Utility:** Sliders

**Config:**
- Slides per page (auto - Int)
- Slide direction (Horizontal/Vertical)
- Touch support (true/false)
- Trigger Slide callback


**Exposed functions:**
- Trigger Slide (requires direction)
- Reset (reset position and slider incase something breaks it and you need to programatically fix it.)

**Exmaple Structure:**
```html
    <div id="slideId" class="slider">
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


## **Utility:** Form/Input Validation
Write docs for the form/input validation utility!