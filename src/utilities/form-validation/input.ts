export default class InputHandler {
    element: HTMLInputElement;
    value: string | number;
    validateConfig: ValidateClassConfig;
    constructor(id: string) {
        this.element = document.getElementById(id) as HTMLInputElement;
        this.value = this.element.value;
    }
    async validateHandler() {
        try {
            // Regex
            await this.checkRegex();
            // Min
            await this.checkMinLength();
            // Max
            await this.checkMaxLength();

            // Return
            return {
                success: true
            }
        }
        catch(err) {
            return {
                success: false
            }
        }
    }

    checkRegex() {
        return new Promise((resolve, reject) => {
            if(this.validateConfig.regex != false) {
                resolve(true);
            }
            else {
                resolve(true);
            }
        });
    }
    checkMinLength() {
        return new Promise((resolve, reject) => {
            if(this.validateConfig.length.min != false) {
                resolve(true);
            }
            else {
                resolve(true);
            }
        });
    }
    checkMaxLength() {
        return new Promise((resolve, reject) => {
            if(this.validateConfig.length.max != false) {
                resolve(true);
            }
            else {
                resolve(true);
            }
        });
    }
}