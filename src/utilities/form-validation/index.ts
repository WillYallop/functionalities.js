interface CustomValidatorObj {
    methodName: string,
    regex: RegExp | false,
    minChar: number | false,
    maxChar: number | false,
    validator?: (value:any) => boolean; 
}

interface FormValidationConfig {
    id?: string;
    onKeyup?: boolean;
    escapeValues?: boolean;
    inputClasses?: {
        valid?: string,
        error?: string
    };
    customValidators?: Array<CustomValidatorObj>;
    onVerify?: () => void
}
enum VerificationMethods { 
    email = 'email', 
    name = 'name',
    longText = 'longText',
    custom = 'custom',
    phone = 'phone',
    address = 'address'
}
enum InputTypes {
    input = 'input',
    textarea = 'textarea',
    select = 'select',
    checkbox = 'checkbox',
    radio = 'radio'
}
type ValidatorClasses = EmailValidator | NameValidator | CustomValidator | PhoneValidator | AddressValidator | LongTextValidator | false;
interface InputObj {
    method: VerificationMethods | false | string,
    element: HTMLElement,
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
import AddressValidator from "./validators/address";

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
    VerificationMethods.phone,
    VerificationMethods.address
];

export default class FormValidation {
    config: FormValidationConfig;
    formElement: HTMLElement;
    inputs: Map<string, InputObj>;
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
                if(element.id) {
                    var validationMethod: false | VerificationMethods | string;
                    var validator: ValidatorClasses;
                    let hasMethod = validationMethods.find( x => x === element.getAttribute('validation-method'));
                    if(hasMethod) {
                        switch(hasMethod) {
                            case VerificationMethods.email: {
                                validator = new EmailValidator(element.id);
                                break;
                            }
                            case VerificationMethods.name: {
                                validator = new NameValidator(element.id);
                                break;
                            }
                            case VerificationMethods.longText: {
                                validator = new LongTextValidator(element.id);
                                break;
                            }
                            case VerificationMethods.phone: {
                                validator = new PhoneValidator(element.id);
                                break;
                            }
                            case VerificationMethods.address: {
                                validator = new AddressValidator(element.id);
                                break;
                            }
                        }
                        validationMethod = hasMethod;
                    }
                    else {
                        // If validation method doesnt exist in our preset validators
                        // Check if the config contains a custom one with a matching name
                        if(this.config.customValidators && this.config.customValidators.length > 0) {
                            let hasCustomMethod = this.config.customValidators.find( x => x.methodName === element.getAttribute('validation-method'));
                            if(hasCustomMethod) {
                                validationMethod = hasCustomMethod.methodName;
                                validator = new CustomValidator(element.id, hasCustomMethod);
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

        console.log(this.inputs);

    }
    // Verify values for non typescript implementation
    verifyConfig():boolean {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;
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

        return hasError;
    }


    // External function
    verify() {

        // Loop through each entry in the inputs map
        // Run the validator
        // Return response

    }
}

// TO DO

// Create a map that contains all of the inputs in a form
// Inputs will contain a required tag and then a validation tag
// Create a base input class that can be extended depending on the type of input
// Go through each input then then apply the checks