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
	 */
	private setupEventListeners(): void {
		// Подписка на события изменений полей формы
		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_DELIVERY_CHANGED,
			(data: { value: string }) => this.validateDelivery(data.value));

		this.eventEmitter.on(AppEvents.UI_ORDER_SELECT_PAYMENT_CHANGED,
			(data: { value: string }) => this.validatePayment(data.value));

		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_MAIL_CHANGED,
			(data: { value: string }) => this.validateEmail(data.value));

		this.eventEmitter.on(AppEvents.UI_ORDER_INPUT_PHONE_CHANGED,
			(data: { value: string }) => this.validatePhone(data.value));
	}

	/**
	 * Валидация адреса доставки
	 * @param {string} address - Адрес доставки
	 * @emits AppEvents.ORDER_DELIVERY_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_VALIDATION_ERROR - При ошибке валидации
	 */
	validateDelivery(address: string): void {
		const isValid = address.trim().length >= 5; // Минимальная длина адреса 5 символов

		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_VALID, {
				address: address.trim()
			});
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'address',
				message: 'Адрес должен содержать не менее 5 символов'
			});
		}
	}

	/**
	 * Валидация способа оплаты
	 * @param {string} method - Способ оплаты
	 * @emits AppEvents.ORDER_PAYMENT_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_PAYMENT_VALIDATION_ERROR - При ошибке валидации
	 */
	validatePayment(method: string): void {
		const isValid = method === 'online' || method === 'cash';

		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALID, {
				method: method as 'online' | 'cash'
			});
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Выберите способ оплаты: онлайн или при получении'
			});
		}
	}

	/**
	 * Валидация email
	 * @param {string} email - Email адрес
	 * @emits AppEvents.ORDER_EMAIL_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_EMAIL_VALIDATION_ERROR - При ошибке валидации
	 */
	validateEmail(email: string): void {
		const isValid = settings.validation.email.test(email.trim());

		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALID, {
				email: email.trim()
			});
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_EMAIL_VALIDATION_ERROR, {
				field: 'email',
				message: 'Введите корректный email (например: user@example.com)'
			});
		}
	}

	/**
	 * Валидация номера телефона
	 * @param {string} phone - Номер телефона
	 * @emits AppEvents.ORDER_PHONE_VALID - При успешной валидации
	 * @emits AppEvents.ORDER_PHONE_VALIDATION_ERROR - При ошибке валидации
	 */
	validatePhone(phone: string): void {
		// Нормализация номера: оставляем только цифры и первый плюс
		const normalizedPhone = phone.startsWith('+')
			? '+' + phone.slice(1).replace(/\D/g, '')
			: phone.replace(/\D/g, '');

		const isValid = settings.validation.phone.test(normalizedPhone);

		if (isValid) {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALID, {
				phone: normalizedPhone
			});
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_PHONE_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Введите телефон в формате +79998887766 (11 цифр после +)'
			});
		}
	}

	/**
	 * Комплексная валидация всей формы заказа
	 * @param {Object} formData - Данные формы
	 * @param {string} formData.address - Адрес доставки
	 * @param {PaymentMethod} formData.payment - Способ оплаты
	 * @param {string} formData.email - Email
	 * @param {string} formData.phone - Телефон
	 * @returns {boolean} Результат валидации
	 */
	validateOrderForm(formData: {
		address: string;
		payment: 'online' | 'cash' | null;
		email: string;
		phone: string;
	}): boolean {
		let isValid = true;

		// Последовательно проверяем все поля
		if (!formData.address || formData.address.trim().length < 5) {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'address',
				message: 'Адрес должен содержать не менее 5 символов'
			});
			isValid = false;
		}

		if (!formData.payment) {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
			isValid = false;
		}

		if (!formData.email || !settings.validation.email.test(formData.email.trim())) {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'email',
				message: 'Введите корректный email'
			});
			isValid = false;
		}

		const normalizedPhone = formData.phone.startsWith('+')
			? '+' + formData.phone.slice(1).replace(/\D/g, '')
			: formData.phone.replace(/\D/g, '');

		if (!formData.phone || !settings.validation.phone.test(normalizedPhone)) {
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Введите корректный телефон'
			});
			isValid = false;
		}

		return isValid;
	}
}