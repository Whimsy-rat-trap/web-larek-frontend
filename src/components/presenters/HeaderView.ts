import {ensureElement} from "../../utils/utils";

export class HeaderView {
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private onBasketClick: () => void;

    constructor(onBasketClick: () => void) {
        this.basketButton = ensureElement<HTMLElement>('.header__basket');
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.onBasketClick = onBasketClick;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.basketButton.addEventListener('click', () => {
            this.onBasketClick();
        });
    }

    public updateCounter(count: number): void {
        this.basketCounter.textContent = count.toString();
    }
}