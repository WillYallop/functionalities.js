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
            validator: config.validator != undefined ? config.validator : false
        }

    }

    async validate() {
        return await this.validateHandler();
        // Custom validator
        // if(this.validateConfig.validator != false) this.checkCustomValidator();
    }

    checkCustomValidator() {
        
    }
}


