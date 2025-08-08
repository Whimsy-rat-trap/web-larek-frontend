import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { ICartServiceForSuccess, IProduct } from '../../types';
import { AppStateModel } from "../models/AppStateModel";

/**
 * Сервис корзины товаров
 * @class CartService
 * @implements {ICartServiceForSuccess}
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {AppStateModel} appState - Состояние приложения
 */
export class CartService implements ICartServiceForSuccess {
	private eventEmitter: EventEmitter;
	private appState: AppStateModel;

	/**
	 * Создает экземпляр CartService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {AppStateModel} appState - Состояние приложения
	 */
	constructor(eventEmitter: EventEmitter, appState: AppStateModel) {
		this.eventEmitter = eventEmitter;
		this.appState = appState;
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для корзины
	 * @private
	 * @listens AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED - Добавление товара в корзину
	 * @listens AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED - Удаление товара из корзины
	 * @listens AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED - Запрос состояния товара в корзине
	 */
	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_BASKET_ITEM_ADDED,
			(data: { id: string }) => this.addToCart(data.id));
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_BASKET_ITEM_REMOVED,
			(data: { id: string }) => this.removeFromCart(data.id));

		/**
		 * Обработчик запроса состояния товара в корзине
		 * @listens AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED
		 * @param {object} data - Данные запроса
		 * @param {string} data.id - ID товара
		 * @param {function} data.callback - Функция обратного вызова
		 */
		this.eventEmitter.on(AppEvents.UI_MODAL_PRODUCT_BUTTON_STATE_CHANGED,
			(data: { id: string, callback: (inCart: boolean) => void }) => {
				const inCart = this.appState.state.basket.some(item => item.id === data.id);
				data.callback(inCart);
			});
	}

	/**
	 * Добавляет товар в корзину
	 * @param {string} productId - ID товара для добавления
	 * @emits AppEvents.BASKET_ITEM_ADDED - При успешном добавлении
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 * @emits AppEvents.BASKET_ITEM_ADD_ERROR - При ошибке добавления
	 */
	addToCart(productId: string): void {
		const product = this.appState.state.catalog.find(p => p.id === productId);
		if (!product || !product.price) return;

		if (!this.appState.state.basket.some(item => item.id === productId)) {
			this.appState.basket = [...this.appState.state.basket, product];
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADDED, { id: productId });
			this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
		} else {
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADD_ERROR, { id: productId });
		}
	}

	/**
	 * Удаляет товар из корзины
	 * @param {string} productId - ID товара для удаления
	 * @emits AppEvents.BASKET_ITEM_REMOVED - При успешном удалении
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 */
	removeFromCart(productId: string): void {
		this.appState.basket = this.appState.state.basket
			.filter(item => item.id !== productId);
		this.eventEmitter.emit(AppEvents.BASKET_ITEM_REMOVED, { id: productId });
		this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
	}

	/**
	 * Очищает корзину полностью
	 * @emits AppEvents.BASKET_CLEAR - При очистке корзины
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 */
	clearCart(): void {
		this.appState.basket = [];
		this.eventEmitter.emit(AppEvents.BASKET_CLEAR);
		this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
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