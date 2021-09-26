export default class InputHandler {
    id: string;
    element: HTMLInputElement;
    value: string;
    validateConfig: ValidateClassConfig;
    constructor(id: string) {
        this.id = id;
        this.element = document.getElementById(id) as HTMLInputElement;
        this.value = this.element.value;
    }
    async validateHandler() { 
        let valid = true;
        let errors = [];

        this.value = this.element.value; // Update value
        let checkRegexRes = await this.checkRegex(); // Regex
        let checkMinLengthRes = await this.checkMinLength(); // Min
        let checkMaxLengthRes = await this.checkMaxLength(); // Max

        if(!checkRegexRes.passed) valid = false, errors.push(checkRegexRes.error);
        if(!checkMinLengthRes.passed) valid = false, errors.push(checkMinLengthRes.error);
        if(!checkMaxLengthRes.passed) valid = false, errors.push(checkMaxLengthRes.error);

        // Return
        return {
            id: this.id,
            valid: valid,
            value: this.value,
            uriComponentEncoded: encodeURIComponent(this.value),
            errors: errors
        }
    }

    checkRegex() {
        if(this.validateConfig.regex !== false) {
            let test = this.validateConfig.regex.test(this.value);
            if(!test) return {
                passed: false,
                error: { number: 0, msg: 'Failed on regex!' }
            };
            else return {
                passed: true
            };
        }
        else {
            return {
                passed: true
            };
        }
    }
    checkMinLength() {
        if(this.validateConfig.length.min !== false) {
            if(this.value.length <= this.validateConfig.length.min) {
                return {
                    passed: false,
                    error: { number: 1, msg: 'Field value is too small.' }
                };
            } else {
                return {
                    passed: true
                };
            }
        }
        else {
            return {
                passed: true
            };
        }
    }
    checkMaxLength() {
        if(this.validateConfig.length.max !== false) {
            if(this.value.length > this.validateConfig.length.max) {
                return {
                    passed: false,
                    error: { number: 2, msg: 'Field value is too large.' }
                };
            } else {
                return {
                    passed: true
                };
            }
        }
        else {
            return {
                passed: true
            };
        }
    }
}