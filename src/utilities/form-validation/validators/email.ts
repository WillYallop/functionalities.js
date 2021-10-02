import InputHandler from "../input";

export default class EmailValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    inputClasses: formInputClasses;
    constructor(id: string, inputClasses: formInputClasses) {
        super(id);
        this.inputClasses = inputClasses;
        let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        this.validateConfig = {
            regex: new RegExp(regex),
            length: {
                min: 0,
                max: 50
            }
        }
    }

    async validate() {
        return await this.validateHandler();
    }
}