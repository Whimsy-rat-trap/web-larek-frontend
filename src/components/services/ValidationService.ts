import { EventEmitter } from "../base/events";
import { AppEvents } from "../../utils/events";

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

	validatePayment(method: string) {
		const isValid = ['online', 'cash'].includes(method);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.PAYMENT_VALID, { method });
		} else {
			this.eventEmitter.emit(AppEvents.PAYMENT_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
		}
	}

	validateEmail(email: string) {
		const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.EMAIL_VALID, { email });
		} else {
			this.eventEmitter.emit(AppEvents.EMAIL_VALIDATION_ERROR, {
				field: 'email',
				message: 'Введите корректный email'
			});
		}
	}

	validatePhone(phone: string) {
		const isValid = /^\+?[\d\s\-\(\)]{7,}$/.test(phone);
		if (isValid) {
			this.eventEmitter.emit(AppEvents.PHONE_VALID, { phone });
		} else {
			this.eventEmitter.emit(AppEvents.PHONE_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Введите корректный телефон'
			});
		}
	}
}