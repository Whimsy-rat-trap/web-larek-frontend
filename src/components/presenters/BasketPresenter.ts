import { BasePresenter } from '../base/BasePresenter';
import { BasketView } from '../views/BasketView';
import { ModalManager } from '../views/ModalManager';
import { Product } from '../../types';
import { Basket } from '../models/Basket';
import { document } from 'postcss';

export class BasketPresenter extends BasePresenter<BasketView, Basket> {
	private basket: BasketView;
	private modalManager: ModalManager;

	constructor(
		private basketModal: HTMLElement,
		private paymentModal: HTMLElement,
		private basketTemplate: HTMLTemplateElement,
		private basketItemTemplate: HTMLTemplateElement,
		private basketCounter: HTMLElement,
		model: any
	) {
		super(null, model, null);
		this.modalManager = ModalManager.getInstance();
	}

	protected init(): void {
		this.setupBasket();
	}

	private setupBasket(): void {
		this.basket = new BasketView(
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
		// document.addEventListener('product:add-to-basket', (event: CustomEvent) => {
		// 	this.addToBasket(event.detail.product);
		// });
		//
		// // Кнопка корзины в хедере
		// const basketButton = document.querySelector('.header__basket');
		// if (basketButton) {
		// 	basketButton.addEventListener('click', () => {
		// 		this.modalManager.openModal(this.basketModal);
		// 	});
		// }
	}

	private addToBasket(product: Product): void {
		this.basket.addItem(product);
		this.model.add(product);
	}

	public getBasket(): BasketView {
		return this.basket;
	}

	protected bindEvents(): void {
		// this.model.on('basket:changed', this.handleBasketChange.bind(this));
		this.eventEmitter.on('product:add-to-basket', this.addToBasket.bind(this));
	}
}
