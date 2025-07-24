import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IBasketState } from "../../types";

/**
 * Сервис корзины товаров
 * @class CartService
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {IBasketState} state - Текущее состояние корзины
 */
export class CartService {
	private eventEmitter: EventEmitter;
	private state: IBasketState;

	/**
	 * Создает экземпляр сервиса корзины
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий для коммуникации между компонентами
	 *
	 * Инициализирует:
	 * - Начальное состояние корзины (пустой массив товаров и нулевая сумма)
	 * - Подписки на события через setupEventListeners()
	 *
	 * Генерируемые события:
	 * @emits AppEvents.CART_ITEM_ADDED При успешном добавлении товара
	 * @emits AppEvents.CART_ITEM_ADD_ERROR При ошибке добавления (дубликат)
	 * @emits AppEvents.CART_ITEM_REMOVED При удалении товара
	 * @emits AppEvents.CART_UPDATED При любом изменении состояния корзины
	 * @emits AppEvents.CART_CLEAR При полной очистке корзины
	 */
	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;
		this.state = {
			items: [],
			total: 0
		};

		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для сервиса корзины
	 * @private
	 * @listens AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED При добавлении товара в корзину → вызывает addToCart()
	 * @listens AppEvents.MODAL_CART_ITEM_REMOVED При удалении товара из корзины → вызывает removeFromCart()
	 * @listens AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED При подтверждении оплаты → вызывает clearCart()
	 */
	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED, (data: { id: string }) =>
			this.addToCart(data.id));
		this.eventEmitter.on(AppEvents.MODAL_CART_ITEM_REMOVED, (data: { id: string }) =>
			this.removeFromCart(data.id));
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED, () =>
			this.clearCart());
	}

	/**
	 * Добавляет товар в корзину
	 * @param {string} productId - ID товара
	 * @emits AppEvents.CART_ITEM_ADDED При успешном добавлении
	 * @emits AppEvents.CART_ITEM_ADD_ERROR При ошибке добавления
	 * @emits AppEvents.CART_UPDATED После обновления состояния
	 */
	addToCart(productId: string) {
		if (!this.state.items.includes(productId)) {
			this.state.items.push(productId);
			this.updateCart();
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADDED, { id: productId });
		} else {
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADD_ERROR, { id: productId });
		}
	}

	/**
	 * Удаляет товар из корзины
	 * @param {string} productId - ID товара
	 * @emits AppEvents.CART_ITEM_REMOVED При успешном удалении
	 * @emits AppEvents.CART_UPDATED После обновления состояния
	 */
	removeFromCart(productId: string) {
		this.state.items = this.state.items.filter(id => id !== productId);
		this.updateCart();
		this.eventEmitter.emit(AppEvents.CART_ITEM_REMOVED, { id: productId });
	}

	/**
	 * Очищает корзину
	 * @emits AppEvents.CART_CLEAR При успешном очистке
	 * @emits AppEvents.CART_UPDATED После обновления состояния
	 */
	clearCart() {
		this.state.items = [];
		this.state.total = 0;
		this.eventEmitter.emit(AppEvents.CART_CLEAR);
	}

	/**
	 * Обновляет состояние корзины
	 * @emits AppEvents.CART_UPDATED После обновления состояния
	 */
	private updateCart() {
		// Здесь будет логика пересчета общей стоимости
		this.eventEmitter.emit(AppEvents.CART_UPDATED, this.state);
	}

	/**
	 * Возвращает текущее состояние корзины
	 * @returns {IBasketState}
	 */
	getState(): IBasketState {
		return this.state;
	}
}