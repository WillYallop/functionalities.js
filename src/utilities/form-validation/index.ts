interface CustomValidatorObj {
    methodName: string,
    regex: RegExp | false,
    length: {
        min: number | false,
        max: number | false
    }
    validator?: (value:any) => boolean; 
}

interface VerifyResponse {
    passed: boolean,
    inputs: Array<VerifyResponseInputObj>
}
interface VerifyResponseInputObj {
    id: string,
    valid: boolean,
    value: string,
    uriComponentEncoded: string,
    errors: Array<object>
}

interface FormValidationConfig {
    id?: string;
    submitBtnId: string,
    onKeyup?: boolean;
    escapeValues?: boolean;
    inputClasses?: {
        valid?: string,
        error?: string
    };
    customValidators?: Array<CustomValidatorObj>;
    onVerify?: (response: VerifyResponse) => void;
    onSuccess: (response: VerifyResponse) => void;
}
enum VerificationMethods { 
    email = 'email', 
    name = 'name',
    longText = 'longText',
    custom = 'custom',
    phone = 'phone'
}
enum InputTypes {
    input = 'input',
    textarea = 'textarea',
    select = 'select',
    checkbox = 'checkbox',
    radio = 'radio'
}
type ValidatorClasses = EmailValidator | NameValidator | CustomValidator | PhoneValidator | LongTextValidator | false;
interface InputObj {
    method: VerificationMethods | false | string,
    element: HTMLInputElement,
    type: InputTypes,
    validator: ValidatorClasses
}




// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

import EmailValidator from "./validators/email";
import NameValidator from "./validators/name";
import LongTextValidator from "./validators/name";
import CustomValidator from "./validators/custom";
import PhoneValidator from "./validators/phone";

const inputTypes = [
    InputTypes.input,
    InputTypes.textarea,
    InputTypes.select,
    InputTypes.checkbox,
    InputTypes.radio
];
const validationMethods = [
    VerificationMethods.email,
    VerificationMethods.name,
    VerificationMethods.longText,
    VerificationMethods.phone
];

export default class FormValidation {
    config: FormValidationConfig;
    formElement: HTMLElement;
    inputs: Map<string, InputObj>;
    submitBtnEle: HTMLElement;
    submitBtnEvent;
    inputKeyupEvent;
    constructor(id: string, config: FormValidationConfig) {
        this.config = {
            onKeyup: true,
            escapeValues: false,
            inputClasses: {
                valid: 'valid',
                error: 'error'
            },
            ...config
        };
        this.config.id = id;
        if(this.config.inputClasses.valid === undefined) this.config.inputClasses.valid  = 'valid';
        if(this.config.inputClasses.error === undefined) this.config.inputClasses.error  = 'error';
        this.inputs = new Map();
        
        this.formElement = document.getElementById(id);
        if(!this.verifyConfig()) this.initialise(); // do work
    }
    initialise() {
        // Add supported elements in the form to the inputs map
        for(let i = 0; i < this.formElement.children.length; i++) {
            let element: any = this.formElement.children[i];
            // if valid input type
            let validElement = inputTypes.find( x => x === element.localName );
            if(validElement) {
                // If the element has no ID skip it.
                // If the validation method is not set, we do not validate than input.
                let eleValidator = element.getAttribute('validation-method');
                let eleValidatorValues = {
                    main: eleValidator != undefined ? eleValidator.split('--')[0] : false,
                    sub: eleValidator != undefined ? eleValidator.split('--')[1] : false
                }

                if(element.id) {
                    var validationMethod: false | VerificationMethods | string;
                    var validator: ValidatorClasses;
                    let hasMethod = validationMethods.find( x => x === eleValidatorValues.main);
                    if(hasMethod) {
                        switch(hasMethod) {
                            case VerificationMethods.email: {
                                validator = new EmailValidator(element.id, this.config.inputClasses);
                                break;
                            }
                            case VerificationMethods.name: {
                                validator = new NameValidator(element.id, this.config.inputClasses);
                                break;
                            }
                            case VerificationMethods.longText: {
                                validator = new LongTextValidator(element.id, this.config.inputClasses);
                                break;
                            }
                            case VerificationMethods.phone: {
                                validator = new PhoneValidator(element.id, eleValidatorValues.sub, this.config.inputClasses);
                                break;
                            }
                        }
                        validationMethod = hasMethod;
                    }
                    else {
                        // If validation method doesnt exist in our preset validators
                        // Check if the config contains a custom one with a matching name
                        if(this.config.customValidators && this.config.customValidators.length > 0) {
                            let hasCustomMethod = this.config.customValidators.find( x => x.methodName === eleValidatorValues.main);
                            if(hasCustomMethod) {
                                validationMethod = hasCustomMethod.methodName;
                                validator = new CustomValidator(element.id, hasCustomMethod, this.config.inputClasses);
                            }
                            else {
                                validationMethod = false;
                                validator = false;
                            }
                        }
                        else {
                            validationMethod = false;
                            validator = false;
                        }
                    };
                    // Set new input in map
                    this.inputs.set(element.id, {
                        method: validationMethod,
                        element: element,
                        type: validElement,
                        validator: validator
                    });
                }
            }
        }

        // Add event listeners
        this.addEventListeners();
    }
    // Verify values for non typescript implementation
    verifyConfig():boolean {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;
        // config.submitBtnId
        if(typeof this.config.submitBtnId != 'string') error(`Typeof "${typeof this.config.submitBtnId }" is not allow for "submitBtnId". It must be type "string".`), hasError = true;
        // config.customValidators
        if(this.config.customValidators != undefined) if(!Array.isArray(this.config.customValidators)) error(`"config.customValidators" must be an array. Refer to the documentation for more information.`), hasError = true;
        // config.onKeyup
        if(typeof this.config.onKeyup != 'boolean') error(`Typeof "${typeof this.config.onKeyup }" is not allow for "onKeyup". It must be type "boolean"!`), hasError = true;
        // config.escapeValues
        if(typeof this.config.escapeValues != 'boolean') error(`Typeof "${typeof this.config.escapeValues }" is not allow for "escapeValues". It must be type "boolean"!`), hasError = true;
        // config.inputClasses
        if(typeof this.config.inputClasses.valid != 'string') error(`Typeof "${typeof this.config.inputClasses.valid }" is not allow for "inputClasses.valid". It must be type "string"!`), hasError = true;
        if(typeof this.config.inputClasses.error != 'string') error(`Typeof "${typeof this.config.inputClasses.error }" is not allow for "inputClasses.error". It must be type "string"!`), hasError = true;
        // config.clickEvent
        if(this.config.onVerify != undefined) if(typeof this.config.onVerify != 'function') error(`Typeof "${typeof this.config.onVerify }" is not allow for "onVerify". It must be type "function"!`), hasError = true;
        // config.onSuccess
        if(this.config.onSuccess != undefined) if(typeof this.config.onSuccess != 'function') error(`Typeof "${typeof this.config.onSuccess }" is not allow for "onSuccess". It must be type "function"!`), hasError = true;

        return hasError;
    }

    // Add events 
    addEventListeners() {
        // Add submit evetnt
        this.submitBtnEle = document.getElementById(this.config.submitBtnId);
        this.submitBtnEvent = submitForm.bind(this);
        this.submitBtnEle.addEventListener('click', this.submitBtnEvent, true);
        // Add keyup events
        if(this.config.onKeyup) {
            // bind
            this.inputKeyupEvent = inputKeyupEvent.bind(this);
            // Add event listenrs
            for (const [key, value] of this.inputs.entries()) {
                if(value.method !== false) {
                    value.element.addEventListener('keyup', this.inputKeyupEvent, true)
                }
            }
        }
    }

    // External function
    async verify(from: 'submit' | 'keyup') {
        let response: VerifyResponse = {
            passed: true,
            inputs: []
        };
        for(const [key, value] of this.inputs.entries()) {
            // Input obj
            let inputObj: VerifyResponseInputObj = {
                id: key,
                valid: true,
                value: '',
                uriComponentEncoded: '',
                errors: [

                ]
            };
            // If validator is a class and not false
            if(value.validator != false) {
                let validateResponse = await value.validator.validate();
                inputObj = { ...inputObj, ...validateResponse };

                if(!validateResponse.valid) response.passed = false;
            } 
            else {
                inputObj.valid = true;
                inputObj.value = value.element.value;
                inputObj.uriComponentEncoded = encodeURIComponent(value.element.value);
            }
            // Push to response inputs
            response.inputs.push(inputObj);
        }
        
        // We only let keyup fire onVerify as we dont want the onSuccess callback to fire on once you finish typing
        this.config.onVerify(response);
        if(from === 'submit') if(response.passed) this.config.onSuccess(response);
    }
    destroy() {

    }
}


// submit event
function submitForm(e) {
    e.preventDefault();
    this.verify('submit');
};

// keyup event
function inputKeyupEvent(e) {
    this.verify('keyup');
};