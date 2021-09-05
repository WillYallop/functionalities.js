interface ApplyBasicStyles {
    slider: HTMLElement,
    wrapper: HTMLElement,
    slides: NodeListOf<HTMLElement>
}

interface AdjustSlides {
    perPage: number,
    direction: 'vertical' | 'horizontal',
    gap: number,
    slider: HTMLElement,
    wrapper: HTMLElement,
    slides: NodeListOf<HTMLElement>
}