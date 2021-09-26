import InputHandler from "../input";

export default class EmailValidator extends InputHandler {
    validateConfig: ValidateClassConfig; 
    constructor(id: string) {
        super(id);
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