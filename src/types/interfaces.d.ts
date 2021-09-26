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
    minChar: number | false,
    maxChar: number | false,
    validator?: (value:any) => boolean; 
}