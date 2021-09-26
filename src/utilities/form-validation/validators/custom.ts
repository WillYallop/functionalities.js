import InputHandler from "../input";

export default class CustomValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    constructor(id: string, config: CustomValidatorObj) {
        super(id);

        // Config
        this.validateConfig = {
            regex: config.regex != undefined ? config.regex : false,
            length: {
                min: config.length.min != undefined ? config.length.min : false,
                max: config.length.max != undefined ? config.length.max : false
            },
            validator: config.validator != undefined ? config.validator : undefined
        }

    }

    async validate() {
        let validateHandler = await this.validateHandler();
        // Custom validator
        if(this.validateConfig.validator !== undefined) {
            let passed = await this.validateConfig.validator(this.value);
            if(passed) validateHandler.valid = true;
            else validateHandler.valid = false, validateHandler.errors.push({ number: 99, msg: `Input with ID "${this.id}" has failed the custom validator method.` })
        }
        return validateHandler;
    }
}


