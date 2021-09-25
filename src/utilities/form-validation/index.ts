interface FormValidationConfig {
    id?: string;
}
enum VerificationMethods { 
    email = 'EmailValidator', 
    name = 'NameValidator',
    custom = 'CustomValidator',
    phone = 'PhoneValidator',
    address = 'AddressValidator'
}
enum InputTypes {
    input = 'input',
    textarea = 'textarea',
    select = 'select',
    checkbox = 'checkbox',
    radio = 'radio'
}
type ValidatorClasses = EmailValidator | NameValidator | CustomValidator | PhoneValidator | AddressValidator;
interface InputObj {
    passed: boolean;
    method: VerificationMethods,
    element: HTMLElement,
    type: InputTypes,
    validator: ValidatorClasses
}


// General
import error from '../../shared/error';
import applyStyle from '../../shared/apply-style';

import EmailValidator from "./validators/email";
import NameValidator from "./validators/name";
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

export default class FormValidation {
    config: FormValidationConfig;
    formElement: HTMLElement;
    inputs: Map<string, InputObj>;
    constructor(id: string, config: FormValidationConfig) {
        this.config = {
            ...config
        };
        this.config.id = id;
        this.inputs = new Map();
        
        this.formElement = document.getElementById(id);
        if(this.verifyConfig) this.initialise(); // do work
    }
    initialise() {
        // Add supported elements in the form to the inputs map
        for(let i = 0; i < this.formElement.children.length; i++) {
            let element = this.formElement.children[i];
            // if valid input type
            let validElement = inputTypes.find( x => x === element.localName );
            if(validElement) {
                console.log(element.localName)
            }
        }

    }
    // Verify values for non typescript implementation
    verifyConfig():boolean {
        let hasError:boolean = false;
        // config.id
        if(typeof this.config.id != 'string') error(`Typeof "${typeof this.config.id }" is not allow for "id". It must be type "string".`), hasError = true;

        return hasError;
    }


    // External function
    verify() {

    }
}

// TO DO

// Create a map that contains all of the inputs in a form
// Inputs will contain a required tag and then a validation tag
// Create a base input class that can be extended depending on the type of input
// Go through each input then then apply the checks




