interface ApplyBasicStyles {
    slider: HTMLElement,
    wrapper: HTMLElement,
    slides: any
}

interface AdjustSlides {
    perPage: number,
    direction: 'vertical' | 'horizontal',
    gap: number,
    slider: HTMLElement,
    wrapper: HTMLElement,
    slides: any
}

// Form Validation
// Inputs map
interface CustomValidatorObj {
    methodName: string,
    regex: RegExp | false,
    length: {
        min: number | false,
        max: number | false
    }
    validator?: (value:any) => boolean; 
}
interface ValidateClassConfig {
    regex: RegExp | false;
    length: {
        min: number | false,
        max: number | false
    }
    validator?: ((value:any) => boolean)
}

//  verify function
interface formInputClasses {
    valid?: string,
    error?: string
}