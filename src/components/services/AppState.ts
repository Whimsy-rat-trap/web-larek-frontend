import { EventEmitter } from "../base/events";
import { IAppState, IProduct, IOrderFormState, PaymentMethod } from '../../types';
import { AppEvents, StateEvents } from '../../types/events';

/**
 * Сервис управления состоянием приложения
 * @class AppState
 * @property {IAppState} _state - Текущее состояние приложения
 * @property {EventEmitter} events - Эмиттер событий приложения
*/
export class AppState {
	/**
	 * Текущее состояние приложения
	 * @private
	 * @type {IAppState}
	 */
	private _state: IAppState = {
		catalog: [],
		basket: [],
		basketTotal: 0,
		order: {
			payment: null,
			address: '',
			email: '',
			phone: '',
			isValid: false,
			errors: []
		},
		preview: null
	};

	/**
	 * Создает экземпляр AppState
	 * @constructor
	 * @param {EventEmitter} events - Эмиттер событий приложения
	 */
	constructor(private events: EventEmitter) {
		events.on(AppEvents.ORDER_PAYMENT_SET, (data: { method: PaymentMethod }) => {
			this.order = { payment: data.method };
		});

		events.on(AppEvents.ORDER_EMAIL_SET, (data: { email: string }) => {
			this.order = { email: data.email };
		});

		events.on(AppEvents.ORDER_PHONE_SET, (data: { phone: string }) => {
			this.order = { phone: data.phone };
		});

		// Можно также добавить для адреса, если ещё нет
		events.on(AppEvents.ORDER_DELIVERY_SET, (data: { address: string }) => {
			this.order = { address: data.address };
		});
	}

	/**
	 * Геттер текущего состояния приложения
	 * @public
	 * @returns {IAppState} Текущее состояние
	 */
	get state(): IAppState {
		return this._state;
	}

	/**
	 * Обновление каталога товаров
	 * @public
	 * @param {IProduct[]} items - Массив товаров
	 * @emits StateEvents.CATALOG_UPDATED - После обновления каталога
	 */
	set catalog(items: IProduct[]) {
		this._state.catalog = items;
		this.events.emit(StateEvents.CATALOG_UPDATED, {
			catalog: this._state.catalog
		});
	}

	/**
	 * Обновление корзины товаров
	 * @public
	 * @param {IProduct[]} items - Массив товаров в корзине
	 * @emits StateEvents.BASKET_UPDATED - После обновления корзины
	 * @emits AppEvents.CART_UPDATED - После обновления корзины
	 */
	set basket(items: IProduct[]) {
		this._state.basket = items;
		this.updateBasketTotal(); // Вызываем отдельный метод для обновления суммы
		this.events.emit(StateEvents.BASKET_UPDATED, {
			basket: this._state.basket,
			basketTotal: this._state.basketTotal
		});
		this.events.emit(AppEvents.BASKET_UPDATED);
	}

	/**
	 * Обновление общей суммы корзины
	 * @private
	 */
	private updateBasketTotal(): void {
		this._state.basketTotal = this._state.basket.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	/**
	 * Геттер общей суммы корзины
	 * @public
	 * @returns {number} Сумма товаров в корзине
	 */
	get basketTotal(): number {
		return this._state.basketTotal;
	}

	/**
	 * Обновление состояния заказа
	 * @public
	 * @param {Partial<IOrderFormState>} form - Частичные данные формы заказа
	 * @emits StateEvents.ORDER_FORM_UPDATED - После обновления формы заказа
	 */
	set order(form: Partial<IOrderFormState>) {
		this._state.order = {
			...this._state.order,
			...form,
			isValid: this.validateOrder(form)
		};
		this.events.emit(StateEvents.ORDER_FORM_UPDATED, {
			order: this._state.order
		});
	}

	/**
	 * Валидация данных заказа
	 * @private
	 * @param {Partial<IOrderFormState>} form - Данные формы для валидации
	 * @returns {boolean} Результат валидации
	 */
	private validateOrder(form: Partial<IOrderFormState>): boolean {
		return !!form.address && !!form.payment &&
			!!form.email && !!form.phone;
	}

	/**
	 * Обновление превью товара
	 * @public
	 * @param {string | null} id - ID товара или null для сброса
	 * @emits StateEvents.PREVIEW_UPDATED - После обновления превью
	 */
	set preview(id: string | null) {
		this._state.preview = id;
		this.events.emit(StateEvents.PREVIEW_UPDATED, {
			preview: this._state.preview
		});
	}
}