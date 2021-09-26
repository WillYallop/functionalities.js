import InputHandler from "../input";

export default class NameValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    constructor(id: string) {
        super(id);
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