import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { ICartServiceForSuccess, IProduct } from '../../types';
import { AppState } from "./AppState";

/**
 * Сервис корзины товаров
 * @class CartService
 * @implements {ICartServiceForSuccess}
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {AppState} appState - Состояние приложения
 */
export class CartService implements ICartServiceForSuccess {
	private eventEmitter: EventEmitter;
	private appState: AppState;

	/**
	 * Создает экземпляр CartService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {AppState} appState - Состояние приложения
	 */
	constructor(eventEmitter: EventEmitter, appState: AppState) {
		this.eventEmitter = eventEmitter;
		this.appState = appState;
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для корзины
	 * @private
	 * @listens AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - Добавление товара в корзину
	 * @listens AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - Удаление товара из корзины
	 */
	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED,
			(data: { id: string }) => this.addToCart(data.id));
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED,
			(data: { id: string }) => this.removeFromCart(data.id));
	}

	/**
	 * Добавляет товар в корзину
	 * @param {string} productId - ID товара для добавления
	 * @emits AppEvents.BASKET_ITEM_ADDED - При успешном добавлении
	 * @emits AppEvents.BASKET_UPDATED - При изменении корзины
	 * @emits AppEvents.BASKET_ITEM_ADD_ERROR - При ошибке добавления
	 */
	addToCart(productId: string): void {
		const product = this.appState.state.catalog.find(p => p.id === productId);
		if (!product || !product.price) return;

		if (!this.appState.state.basket.some(item => item.id === productId)) {
			this.appState.basket = [...this.appState.state.basket, product];
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADDED, { id: productId });
			this.eventEmitter.emit(AppEvents.BASKET_UPDATED);
		} else {
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADD_ERROR, { id: productId });
		}
	}

	/**
	 * Удаляет товар из корзины
	 * @param {string} productId - ID товара для удаления
	 * @emits AppEvents.BASKET_ITEM_REMOVED - При успешном удалении
	 * @emits AppEvents.BASKET_UPDATED - При изменении корзины
	 */
	removeFromCart(productId: string): void {
		this.appState.basket = this.appState.state.basket
			.filter(item => item.id !== productId);
		this.eventEmitter.emit(AppEvents.BASKET_ITEM_REMOVED, { id: productId });
		this.eventEmitter.emit(AppEvents.BASKET_UPDATED);
	}

	/**
	 * Очищает корзину полностью
	 * @emits AppEvents.BASKET_CLEAR - При очистке корзины
	 * @emits AppEvents.BASKET_UPDATED - При изменении корзины
	 */
	clearCart(): void {
		this.appState.basket = [];
		this.eventEmitter.emit(AppEvents.BASKET_CLEAR);
		this.eventEmitter.emit(AppEvents.BASKET_UPDATED);
	}

	/**
	 * Возвращает список товаров в корзине
	 * @returns {IProduct[]} Массив товаров в корзине
	 */
	getCartItems(): IProduct[] {
		return this.appState.state.basket;
	}

	/**
	 * Возвращает общую стоимость товаров в корзине
	 * @returns {number} Суммарная стоимость товаров
	 */
	getTotalPrice(): number {
		return this.appState.basketTotal;
	}
}