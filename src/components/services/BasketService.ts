import { EventEmitter } from '../base/events';
import { AppEvents } from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';

/**
 * Сервис корзины товаров
 * @class BasketService
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {AppStateModel} appState - Состояние приложения
 */
export class BasketService {
	/**
	 * Создает экземпляр CartService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {AppStateModel} appState - Состояние приложения
	 */
	constructor(
		private eventEmitter: EventEmitter,
		private appState: AppStateModel
	) {}

	/**
	 * Добавляет товар в корзину
	 * @param {string} productId - ID товара для добавления
	 * @emits AppEvents.BASKET_ITEM_ADDED - При успешном добавлении
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 * @emits AppEvents.BASKET_ITEM_ADD_ERROR - При ошибке добавления
	 */
	addToBasket(productId: string): void {
		const product = this.appState.state.catalog.find((p) => p.id === productId);
		if (!product || !product.price) return;

		if (!this.appState.state.basket.some((item) => item.id === productId)) {
			this.appState.basket = [...this.appState.state.basket, product];
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADDED, { id: productId });
			this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
		} else {
			this.eventEmitter.emit(AppEvents.BASKET_ITEM_ADD_ERROR, {
				id: productId,
			});
		}
	}

	/**
	 * Удаляет товар из корзины
	 * @param {string} productId - ID товара для удаления
	 * @emits AppEvents.BASKET_ITEM_REMOVED - При успешном удалении
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 */
	removeFromBasket(productId: string): void {
		this.appState.basket = this.appState.state.basket.filter(
			(item) => item.id !== productId
		);
		this.eventEmitter.emit(AppEvents.BASKET_ITEM_REMOVED, { id: productId });
		this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
	}

	/**
	 * Очищает корзину полностью
	 * @emits AppEvents.BASKET_CLEAR - При очистке корзины
	 * @emits AppEvents.BASKET_CONTENT_CHANGED - При изменении корзины
	 */
	clearBasket(): void {
		this.appState.basket = [];
		this.eventEmitter.emit(AppEvents.BASKET_CONTENT_CHANGED);
	}
}
