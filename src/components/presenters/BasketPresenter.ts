import { BasePresenter } from '../base/BasePresenter';
import { Basket } from '../views/Basket';
import { ModalManager } from '../views/ModalManager';
import { Product } from '../../types';

export class BasketPresenter extends BasePresenter {
    private basket: Basket;
    private modalManager: ModalManager;

    constructor(
        private basketModal: HTMLElement,
        private paymentModal: HTMLElement,
        private basketTemplate: HTMLTemplateElement,
        private basketItemTemplate: HTMLTemplateElement,
        private basketCounter: HTMLElement,
        model: any
    ) {
        super(null, model);
        this.modalManager = ModalManager.getInstance();
    }

    protected init(): void {
        this.setupBasket();
        this.setupEventListeners();
    }

    private setupBasket(): void {
        this.basket = new Basket(
            this.basketTemplate,
            this.basketItemTemplate,
            this.basketModal,
            this.paymentModal,
            (modal) => this.modalManager.openModal(modal),
            (modal) => this.modalManager.closeModal(modal)
        );
    }

    private setupEventListeners(): void {
        // Слушаем события добавления товаров в корзину
        document.addEventListener('product:add-to-basket', (event: CustomEvent) => {
            this.addToBasket(event.detail.product);
        });

        // Кнопка корзины в хедере
        const basketButton = document.querySelector('.header__basket');
        if (basketButton) {
            basketButton.addEventListener('click', () => {
                this.modalManager.openModal(this.basketModal);
            });
        }
    }

    private addToBasket(product: Product): void {
        this.basket.addItem(product);
        // Уведомляем модель о изменении
        this.model.addToBasket(product);
    }

    public getBasket(): Basket {
        return this.basket;
    }
}