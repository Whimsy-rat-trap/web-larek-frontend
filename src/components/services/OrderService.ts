import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IOrderFormState, PaymentMethod, IValidationError } from "../../types";

/**
 * Сервис оформления заказа
 * @class OrderService
 * @property {IOrderFormState} state - Текущее состояние формы заказа
 */
export class OrderService {
	private state: IOrderFormState = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		isValid: false, // Используем только isValid
		errors: [] as IValidationError[]
	};

	constructor(private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () => this.initOrder());
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () =>
			this.prepareOrder('delivery'));
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED, () =>
			this.prepareOrder('payment'));
	}

	/**
	 * Инициализирует процесс оформления заказа
	 * @private
	 * @emits AppEvents.ORDER_INITIATED
	 */
	private initOrder(): void {
		this.eventEmitter.emit(AppEvents.ORDER_INITIATED);
	}

	/**
	 * Подготавливает заказ к отправке
	 * @private
	 * @param {'delivery' | 'payment'} step - Текущий шаг оформления
	 * @emits AppEvents.ORDER_READY
	 */
	private prepareOrder(step: 'delivery' | 'payment'): void {
		if (step === 'delivery') {
			this.eventEmitter.emit(AppEvents.ORDER_READY, { step: 'delivery' });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_READY, { step: 'payment' });
		}
	}

	/**
	 * Обновляет данные о доставке
	 * @param {string} address - Адрес доставки
	 * @emits AppEvents.ORDER_READY
	 */
	public updateDelivery(address: string): void {
		this.state.address = address;
		this.validate();
	}

	/**
	 * Обновляет способ оплаты в состоянии заказа
	 * @public
	 * @param {PaymentMethod} method - Выбранный способ оплаты
	 * @emits AppEvents.ORDER_READY После валидации
	 */
	public updatePayment(method: PaymentMethod): void {
		this.state.payment = method;
		this.validate();
	}

	/**
	 * Обновляет email в состоянии заказа
	 * @public
	 * @param {string} email - Введенный email
	 * @emits AppEvents.ORDER_READY После валидации
	 */
	public updateEmail(email: string): void {
		this.state.email = email;
		this.validate();
	}

	/**
	 * Обновляет телефон в состоянии заказа
	 * @public
	 * @param {string} phone - Введенный телефон
	 * @emits AppEvents.ORDER_READY После валидации
	 */
	public updatePhone(phone: string): void {
		this.state.phone = phone;
		this.validate();
	}

	/**
	 * Проверяет валидность данных формы заказа
	 * @private
	 * @emits AppEvents.ORDER_READY С результатом валидации
	 */
	private validate(): void {
		// Проверяем обязательные поля для текущего шага
		const isDeliveryValid = !!this.state.address && !!this.state.payment;
		const isContactsValid = !!this.state.email && !!this.state.phone;

		this.state.isValid = isDeliveryValid && isContactsValid;

		// Формируем ошибки
		this.state.errors = [];

		if (!this.state.address) {
			this.state.errors.push({
				field: 'address',
				message: 'Введите адрес доставки'
			});
		}

		if (!this.state.payment) {
			this.state.errors.push({
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
		}

		if (!this.state.email) {
			this.state.errors.push({
				field: 'email',
				message: 'Введите email'
			});
		}

		if (!this.state.phone) {
			this.state.errors.push({
				field: 'phone',
				message: 'Введите телефон'
			});
		}

		this.eventEmitter.emit(AppEvents.ORDER_READY, { isValid: this.state.isValid });
	}

	public getState(): IOrderFormState {
		return this.state;
	}
}