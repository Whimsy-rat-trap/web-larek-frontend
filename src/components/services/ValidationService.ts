import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";

/**
 * Сервис валидации данных формы заказа
 * @class ValidationService
 */
export class ValidationService {
	private eventEmitter: EventEmitter;

	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;

		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED, (data: { value: string }) =>
			this.validateDelivery(data.value));
		this.eventEmitter.on(AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED, (data: { value: string }) =>
			this.validatePayment(data.value));
		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_MAIL_CHANGED, (data: { value: string }) =>
			this.validateEmail(data.value));
		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED, (data: { value: string }) =>
			this.validatePhone(data.value));
	}

	/**
	 * Проверяет валидность адреса доставки
	 * @param {string} address - Адрес доставки
	 * @emits AppEvents.ORDER_DELIVERY_VALID При валидном адресе
	 * @emits AppEvents.ORDER_VALIDATION_ERROR При ошибке
	 */
	validateDelivery(address: string) {
		const isValid = address.trim().length > 0;
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_VALID, { address });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'address',
				message: 'Введите адрес доставки'
			});
		}
	}

	/**
	 * Проверяет валидность способа оплаты
	 * @param {string} method - Способ оплаты
	 * @emits AppEvents.PAYMENT_VALID При валидном способе
	 * @emits AppEvents.PAYMENT_VALIDATION_ERROR При ошибке
	 */
	validatePayment(method: string) {
		const isValid = ['online', 'cash'].includes(method);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALID, { method });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
		}
	}

	/**
	 * Проверяет валидность email
	 * @param {string} email - Email
	 * @emits AppEvents.EMAIL_VALID При валидном email
	 * @emits AppEvents.EMAIL_VALIDATION_ERROR При ошибке
	 */
	validateEmail(email: string) {
		const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALID, { email });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALIDATION_ERROR, {
				field: 'email',
				message: 'Введите корректный email'
			});
		}
	}

	/**
	 * Проверяет валидность телефона
	 * @param {string} phone - Телефон
	 * @emits AppEvents.PHONE_VALID При валидном телефоне
	 * @emits AppEvents.PHONE_VALIDATION_ERROR При ошибке
	 */
	validatePhone(phone: string) {
		const isValid = /^\+?[\d\s\-\(\)]{7,}$/.test(phone);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALID, { phone });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Введите корректный телефон'
			});
		}
	}
}