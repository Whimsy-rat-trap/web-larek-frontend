import { EventEmitter } from "../base/events";
import { AppEvents } from "../../utils/events";
import { IOrderFormState, PaymentMethod, IValidationError } from "../../types";

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

	private initOrder(): void {
		this.eventEmitter.emit(AppEvents.ORDER_INITIATED);
	}

	private prepareOrder(step: 'delivery' | 'payment'): void {
		if (step === 'delivery') {
			this.eventEmitter.emit(AppEvents.ORDER_READY, { step: 'delivery' });
		} else {
			this.eventEmitter.emit(AppEvents.ORDER_READY, { step: 'payment' });
		}
	}

	public updateDelivery(address: string): void {
		this.state.address = address;
		this.validate();
	}

	public updatePayment(method: PaymentMethod): void {
		this.state.payment = method;
		this.validate();
	}

	public updateEmail(email: string): void {
		this.state.email = email;
		this.validate();
	}

	public updatePhone(phone: string): void {
		this.state.phone = phone;
		this.validate();
	}

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