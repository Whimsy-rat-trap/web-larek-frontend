import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { settings } from '../../utils/constants';

/**
 * Сервис валидации форм
 * @class ValidationService
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 */
export class ValidationService {
	private eventEmitter: EventEmitter;

	/**
	 * Создает экземпляр ValidationService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для валидации
	 * @private
	 * @listens AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED - Изменение поля адреса доставки
	 * @listens AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED - Изменение способа оплаты
	 * @listens AppEvents.UI_ORDER_INPUT_MAIL_CHANGED - Изменение поля email
	 * @listens AppEvents.UI_ORDER_INPUT_PHONE_CHANGED - Изменение поля телефона
	 */
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
	 * Валидация адреса доставки
	 * @param {string} address - Адрес доставки
	 * @emits AppEvents.ORDER_DELIVERY_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_VALIDATION_ERROR - При ошибке валидации
	 */
	validateDelivery(address: string) {
		const isValid = address.trim().length > 0;
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_VALID, { address });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'address',
				message: 'Необходимо ввести адрес'
			});
		}
	}

	/**
	 * Валидация способа оплаты
	 * @param {string} method - Способ оплаты
	 * @emits AppEvents.ORDER_PAYMENT_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_PAYMENT_VALIDATION_ERROR - При ошибке валидации
	 */
	validatePayment(method: string) {
		const isValid = ['online', 'cash'].includes(method);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALID, { method });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Необходимо выбрать форму оплаты'
			});
		}
	}

	/**
	 * Валидация email
	 * @param {string} email - Email адрес
	 * @emits AppEvents.ORDER_EMAIL_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_EMAIL_VALIDATION_ERROR - При ошибке валидации
	 */
	validateEmail(email: string) {
		const isValid = settings.validation.email.test(email);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALID, { email });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALIDATION_ERROR, {
				field: 'email',
				message: 'Необходимо ввести email'
			});
		}
	}

	/**
	 * Валидация номера телефона
	 * @param {string} phone - Номер телефона
	 * @emits AppEvents.ORDER_PHONE_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_PHONE_VALIDATION_ERROR - При ошибке валидации
	 */
	validatePhone(phone: string) {
		// Удаляем все нецифровые символы, кроме начального плюса
		const normalizedPhone = phone.startsWith('+')
			? '+' + phone.replace(/\D/g, '')
			: phone.replace(/\D/g, '');

		const isValid = settings.validation.phone.test(normalizedPhone);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALID, { phone });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Необходимо ввести номер телефона'
			});
		}
	}
}