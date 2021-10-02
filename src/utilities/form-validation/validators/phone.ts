import InputHandler from "../input";

export default class PhoneValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    inputClasses: formInputClasses;
    constructor(id: string, subValidator: string, inputClasses: formInputClasses) {
        super(id);
        this.inputClasses = inputClasses;
        // Set validator based on if we have a subValidator or not
        switch(subValidator) {
            case 'uk': {
                this.validateConfig = {
                    regex: new RegExp(/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/),
                    length: {
                        min: 0,
                        max: 100
                    }
                }
                break;
            }
            default: {
                this.validateConfig = {
                    regex: new RegExp(/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/),
                    length: {
                        min: 0,
                        max: 50
                    }
                }
                break;
            }
        }
    }

    async validate() {
        return await this.validateHandler()
    }
}