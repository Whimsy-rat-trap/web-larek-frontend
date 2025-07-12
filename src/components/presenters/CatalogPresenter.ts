import { BasePresenter } from '../base/BasePresenter';
import { CatalogView } from '../views/CatalogView';
import { ModalManager } from '../views/ModalManager';
import { Product } from '../../types';
import { CardView } from '../views/CardView';
import { Catalog } from '../models/Catalog';
import { ApiService } from '../services/ApiService';
import { document } from 'postcss';
import * as console from 'node:console';

export class CatalogPresenter extends BasePresenter<CatalogView, Catalog> {
	private cardList: CatalogView;
	private modalManager: ModalManager;

	constructor(
		private galleryContainer: HTMLElement,
		private productModal: HTMLElement,
		private cardCatalogTemplate: HTMLTemplateElement,
		private cardPreviewTemplate: HTMLTemplateElement,
		model: Catalog
	) {
		super(null, model, null);
		this.modalManager = ModalManager.getInstance();
	}

	protected init(): void {
		this.setupCardList();
		this.loadProducts();
	}

	private setupCardList(): void {
		this.cardList = new CatalogView(
			this.galleryContainer,
			this.cardCatalogTemplate,
			{
				onClick: (event) => this.handleCardClick(event),
			}
		);
	}

	private handleCardClick(event: MouseEvent): void {
		const cardElement = event.currentTarget as HTMLElement;
		const cardId = cardElement.dataset.id;
		if (!cardId) return;

		const product = this.model.products.find(
			(item: Product): boolean => item.id === cardId
		);
		if (!product) return;

		this.showProductModal(product);
	}

	private showProductModal(product: Product): void {
		const modalContent = this.productModal.querySelector('.modal__content');
		if (!modalContent) return;

		const previewCard = new CardView(this.cardPreviewTemplate);
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
		this.eventEmitter.emit('product:add-to-basket', product);
		this.modalManager.closeModal(this.productModal);
	}

	private async loadProducts(): Promise<void> {
		this.galleryContainer.innerHTML =
			'<p class="loading">Загрузка товаров...</p>';

		try {
			const apiService = new ApiService();
			const products = await apiService.getProducts();
			this.cardList.addCards(products);
		} catch (error) {
			console.error('Не удалось загрузить товары:', error);
			this.galleryContainer.innerHTML =
				'<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
		}
	}

	public async initialize(): Promise<void> {
		await this.loadProducts();
	}

	protected bindEvents(): void {
	}
}
