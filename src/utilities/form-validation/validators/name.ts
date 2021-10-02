import InputHandler from "../input";

export default class NameValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    inputClasses: formInputClasses;
    constructor(id: string, inputClasses: formInputClasses) {
        super(id);
        this.inputClasses = inputClasses;
        let regex = /^[a-z A-Z]+(?:-[a-z A-Z]+)*$/;
        this.validateConfig = {
            regex: new RegExp(regex),
            length: {
                min: 0,
                max: 50
            }
        }
    }
    async validate() {
        return await this.validateHandler()
    }
}