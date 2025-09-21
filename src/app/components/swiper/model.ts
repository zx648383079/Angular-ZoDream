export interface SwiperEvent {
    get backable(): boolean;
    get nextable(): boolean;
    back(): void;
    next(): void;
    navigate(index: number): void;
}