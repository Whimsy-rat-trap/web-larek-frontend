import { BasePresenter } from '../base/BasePresenter';
import { AppData } from '../AppData';
import { CardList } from '../CardList';
import { ModalManager } from '../ModalManager';
import {Product} from "../../types";
import {Card} from "../Card";

export class ProductPresenter extends BasePresenter {
    private cardList: CardList;
    private modalManager: ModalManager;

    constructor(
        private galleryContainer: HTMLElement,
        private productModal: HTMLElement,
        private cardCatalogTemplate: HTMLTemplateElement,
        private cardPreviewTemplate: HTMLTemplateElement,
        model: AppData
    ) {
        super(null, model);
        this.modalManager = ModalManager.getInstance();
    }

    protected init(): void {
        this.setupCardList();
        this.loadProducts();
    }

    private setupCardList(): void {
        this.cardList = new CardList(
            this.galleryContainer,
            this.cardCatalogTemplate,
            {
                onClick: (event) => this.handleCardClick(event)
            }
        );
    }

    private handleCardClick(event: MouseEvent): void {
        const cardElement = event.currentTarget as HTMLElement;
        const cardId = cardElement.dataset.id;
        if (!cardId) return;

        const product = this.model.catalog.find((item: Product): boolean => item.id === cardId);
        if (!product) return;

        this.showProductModal(product);
    }

    private showProductModal(product: Product): void {
        const modalContent = this.productModal.querySelector('.modal__content');
        if (!modalContent) return;

        const previewCard = new Card(this.cardPreviewTemplate);
        modalContent.innerHTML = '';
        modalContent.appendChild(previewCard.render(product));

        const addToCartButton = this.productModal.querySelector('.button');
        if (addToCartButton) {
            // Удаляем предыдущие обработчики
            addToCartButton.replaceWith(addToCartButton.cloneNode(true));
            const newButton = this.productModal.querySelector('.button');
            newButton.addEventListener('click', () => {
                this.addToBasket(product);
            });
        }

        this.modalManager.openModal(this.productModal);
    }

    private addToBasket(product: Product): void {
        // Используем событийную систему для уведомления других компонентов
        document.dispatchEvent(new CustomEvent('product:add-to-basket', {
            detail: { product }
        }));
        this.modalManager.closeModal(this.productModal);
    }

    private async loadProducts(): Promise<void> {
        this.galleryContainer.innerHTML = '<p class="loading">Загрузка товаров...</p>';

        try {
            const products = await this.model.getProducts();
            this.cardList.addCards(products);
        } catch (error) {
            console.error('Не удалось загрузить товары:', error);
            this.galleryContainer.innerHTML = '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
        }
    }

    public async initialize(): Promise<void> {
        await this.loadProducts();
    }
}