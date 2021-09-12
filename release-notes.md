# Functionalities.js Release Notes

## v0.3.0
> features
- [Sticky Headers]: Released the sticky headers utility.

> bug fixes
- [Sliders]: Fixed issue where leaving the config.classes object empty would through errors.

## v0.2.1
> changes
- [Build] Forgot to build in previous version...
- [Other] Updated readme to contain more info and spiced it up with some images.

## v0.2.0
> features
- [Sliders]: Added new config.type option: fade.
- [Sliders]: Added full support for the toSlide function.
- [Sliders]: Updated perPage auto option to now fully support the loop slide type, along with infinite.
- [Sliders]: Added new callback for clickEvent, which adds the given function as a click event on each slide. This is destroyed when calling the destroy function.

> bug fixes
- [Sliders]: Fixed issue where infinite movement handlers would transition right twice due to not removing old animation event listener.
- [Sliders]: Added preventDefault on touch/mouse events for navigation to stop the page scrolling if the user is trying to move the slider.

> changes
- [Sliders]: Reworked how slider transition types are handled. Now instead of only having loop true/false. We now have config.types where the slider type can be specified.
- [Other]: Updated repository readme to support all new features and changes.

## v0.1.0
> features
- [Sliders]: released as stable beta.