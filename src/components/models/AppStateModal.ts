import { EventEmitter } from "../base/events";
import { IAppState, IOrderFormState, IProduct, IValidationError, PaymentMethod } from '../../types';
import { AppEvents, StateEvents } from '../../types/events';

/**
 * Класс для управления состоянием приложения
 * @class AppStateModal
 * @property {IAppState} _state - Текущее состояние приложения
 * @property {EventEmitter} events - Эмиттер событий для уведомлений об изменениях состояния
 */
export class AppStateModal {
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
	 * Создает экземпляр AppStateModal
	 * @constructor
	 * @param {EventEmitter} events - Эмиттер событий для уведомлений
	 */
	constructor(private events: EventEmitter) {
		events.on(AppEvents.UI_ORDER_BUTTON_PAYMENT_SET, (data: { method: PaymentMethod }) => {
			this.order = { payment: data.method };
		});

		events.on(AppEvents.ORDER_EMAIL_SET, (data: { email: string }) => {
			this.order = { email: data.email };
		});

		events.on(AppEvents.ORDER_PHONE_SET, (data: { phone: string }) => {
			this.order = { phone: data.phone }; // Исправлено: было data.email
		});

		events.on(AppEvents.ORDER_DELIVERY_SET, (data: { address: string }) => {
			this.order = { address: data.address };
		});
	}

	/**
	 * Получает текущее состояние приложения
	 * @readonly
	 * @returns {IAppState} Текущее состояние
	 */
	get state(): IAppState {
		return this._state;
	}

	/**
	 * Устанавливает каталог товаров и уведомляет об изменении
	 * @param {IProduct[]} items - Массив товаров для каталога
	 */
	set catalog(items: IProduct[]) {
		this._state.catalog = items;
		this.events.emit(StateEvents.CATALOG_STATE_UPDATED, {
			catalog: this._state.catalog
		});
	}

	/**
	 * Устанавливает корзину товаров и уведомляет об изменении
	 * @param {IProduct[]} items - Массив товаров для корзины
	 */
	set basket(items: IProduct[]) {
		this._state.basket = items;
		this.updateBasketTotal();
		this.events.emit(StateEvents.BASKET_STATE_CHANGED, {
			basket: this._state.basket,
			basketTotal: this._state.basketTotal
		});
	}

	/**
	 * Обновляет общую сумму товаров в корзине
	 * @private
	 */
	private updateBasketTotal(): void {
		this._state.basketTotal = this._state.basket.reduce(
			(sum, item) => sum + (item.price || 0),
			0
		);
	}

	/**
	 * Возвращает общую сумму товаров в корзине
	 * @readonly
	 * @returns {number} Сумма товаров в корзине
	 */
	get basketTotal(): number {
		return this._state.basketTotal;
	}

	/**
	 * Обновляет данные формы заказа и проверяет валидность
	 * @param {Partial<IOrderFormState>} form - Объект с обновляемыми полями формы
	 * @emits StateEvents.ORDER_STATE_FORM_UPDATED - Событие обновления формы заказа
	 */
	set order(form: Partial<IOrderFormState>) {
		this._state.order = {
			...this._state.order,
			...form,
			isValid: this.validateOrder(form),
			errors: this.validateOrderFields(form)
		};

		this.events.emit(StateEvents.ORDER_STATE_FORM_UPDATED, {
			order: this._state.order
		});
	}

	/**
	 * Проверяет валидность формы заказа
	 * @private
	 * @param {Partial<IOrderFormState>} form - Объект с обновляемыми полями формы
	 * @returns {boolean} Результат проверки валидности
	 */
	private validateOrder(form: Partial<IOrderFormState>): boolean {
		const newState = { ...this._state.order, ...form };
		return !!newState.address && !!newState.payment &&
			!!newState.email && !!newState.phone;
	}

	/**
	 * Проверяет поля формы заказа и возвращает массив ошибок
	 * @private
	 * @param {Partial<IOrderFormState>} form - Объект с обновляемыми полями формы
	 * @returns {IValidationError[]} Массив ошибок валидации
	 */
	private validateOrderFields(form: Partial<IOrderFormState>): IValidationError[] {
		const errors: IValidationError[] = [];
		const newState = { ...this._state.order, ...form };

		if (!newState.address) {
			errors.push({ field: 'address', message: 'Введите адрес доставки' });
		}

		if (!newState.payment) {
			errors.push({ field: 'payment', message: 'Выберите способ оплаты' });
		}

		if (!newState.email) {
			errors.push({ field: 'email', message: 'Введите email' });
		}

		if (!newState.phone) {
			errors.push({ field: 'phone', message: 'Введите телефон' });
		}

		return errors;
	}

	/**
	 * Устанавливает ID товара для предпросмотра
	 * @param {string | null} id - ID товара или null для сброса
	 * @emits StateEvents.PREVIEW_STATE_UPDATED - Событие обновления превью
	 */
	set preview(id: string | null) {
		this._state.preview = id;
		this.events.emit(StateEvents.PREVIEW_STATE_UPDATED, {
			preview: this._state.preview
		});
	}
}