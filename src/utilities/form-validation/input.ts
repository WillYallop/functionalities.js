export default class InputHandler {
    element: HTMLInputElement;
    value: string | number;
    validateConfig: ValidateClassConfig;
    constructor(id: string) {
        this.element = document.getElementById(id) as HTMLInputElement;
        this.value = this.element.value;
    }
    async validateHandler() {

        // Check the value matches the regex
        console.log(this.validateConfig);

        // Check that the value is within its required length.
        console.log(this.value);

    }
}