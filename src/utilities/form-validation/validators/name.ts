import InputHandler from "../input";

export default class NameValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    constructor(id: string) {
        super(id);

        this.validateConfig = {
            regex: new RegExp('test'),
            length: {
                min: 0,
                max: 50
            }
        }

        this.validateHandler();
    }
}