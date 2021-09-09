type MovementType = () => string;
type triggerSlideCbType = (direction: SlideDirectionType) => {};
// Type definitions - only import facing ones
type ConfigDirectionType = 'vertical' | 'horizontal';
type SlideDirectionType = 'rightDown' | 'leftUp';