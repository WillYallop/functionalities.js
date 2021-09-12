<img src="https://github.com/WillYallop/functionalities.js/raw/master/images/sticky-headers.jpeg" style="width: 100%; margin-bottom: 20px;">


# Utility: Sticky Header
> released

Sticky headers is as it sounds. Just add an ID to your header, create a new instance of the sticky header utility, pass it some config or use the defaults. This utility only adds functionality. No CSS! This is to ensure flexibility.

Then depending on the users scroll a handfull of classes will be added to the header. One for scrolled down, one for scrolled up and then one for when you are at the very top of the page. This will allow you to create headers that show and hide depennding on the direction the user scrolls, and that have different styles if not scrolled at all.

### Features

- Adds one of 3 configurable classes depending on scroll position.
- Has a callback function you that fires on state change.

### Example

Here is a basic exmaple of how to set up a slider. Feel free to conifgure it how you like, find out more about the config bellow.

```html
<header id="siteHeader">

</header>
```

```javascript
import { StickyHeaders } from 'functionalities.js';

const headerInstance = new StickyHeaders('siteHeader', {
    triggerDistance: 50,
    classes: {
        top: 'sticky-top',
        movedDown: 'sticky-down',
        movedUp: 'sticky-up'
    },
    onChange: (data) => {
        console.log(data);
    }
});
```

### Config - Types

```typescript
interface Config {
    triggerDistance?: number,
    classes?: {
        top?: string,
        movedDown?: string,
        movedUp?: string
    },
    onChange?: (response: {
        state: string,
        scrollPos: number
    }) => void
};
```

### Config - Breakdown

Refer to the config types above to see what values can be used for each config key.

| Key      | Description |
| ----------- | ----------- |
| triggerDistance      | Specify the total distance from the top of the page you want to add the movedDown and movedUp classes. |

| Key: classes | Description |
| ----------- | ----------- |
| top | Specify the class you want to use for when the header is above your triggerDistance value (at the top of the page). |
| movedDown | Specify the class you want to add to the header when you scroll down. |
| movedUp | Specify the class you want to add to the header when you scroll up.|

| Callbacks | Description |
| ----------- | ----------- |
| onChange | Specify a callback function for onChange. Whenever the state of th. Refer to the config types above for the response data. |


### Functions

| Functions | Required Paramaters | Returns | Description |
| ----------- | ----------- | ----------- | ----------- |
| destroy | N/A | void | Calling this function will destroy all eventListeners for this instance of sticky headers. |


### Limitations / Future Features / Notes

> notes
- [Note]: As has been mentioned before, this does not include any CSS, it onyl adds classes to your header based on the scroll position.