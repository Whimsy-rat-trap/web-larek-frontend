import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IOrderFormState, PaymentMethod, IValidationError, IOrderRequest } from '../../types';

/**
 * Сервис оформления заказа
 * @class OrderService
 * @property {IOrderFormState} state - Текущее состояние формы заказа
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 */
export class OrderService {
	/**
	 * Состояние формы заказа
	 * @private
	 * @type {IOrderFormState}
	 */
	private state: IOrderFormState = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		isValid: false,
		errors: [] as IValidationError[]
	};

	/**
	 * Создает экземпляр OrderService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для сервиса заказов
	 * @private
	 * @listens AppEvents.UI_ORDER_BUTTON_START_CLICKED - При начале оформления заказа
	 * @listens AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - При переходе к следующему шагу
	 * @listens AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED - При подтверждении оплаты
	 * @listens AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - При нажатии кнопки оплаты
	 */
	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () => this.initOrder());
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () =>
			this.prepareOrder('delivery'));
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED, () =>
			this.prepareOrder('payment'));
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAY_CLICKED, () => {
			console.log('Pay button clicked - final validation');
			this.validate();
		});
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
	 * Подготавливает заказ к отправке в зависимости от текущего шага
	 * @private
	 * @param {'delivery' | 'payment'} step - Текущий шаг оформления
	 * @emits AppEvents.ORDER_READY - Когда заказ готов к отправке
	 * @emits AppEvents.ORDER_DELIVERY_COMPLETED - При завершении шага доставки
	 */
	private prepareOrder(step: 'delivery' | 'payment'): void {
		if (step === 'payment') {
			const orderData: IOrderRequest = {
				payment: this.state.payment,
				address: this.state.address,
				email: this.state.email,
				phone: this.state.phone,
				total: 0,
				items: []
			};

			if (this.state.isValid) {
				this.eventEmitter.emit(AppEvents.ORDER_READY, orderData);
			}
		} else {
			this.validate();
			this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_COMPLETED);
		}
	}

	/**
	 * Обновляет данные о доставке и выполняет валидацию
	 * @public
	 * @param {string} address - Адрес доставки
	 * @emits AppEvents.ORDER_DELIVERY_SET - При обновлении адреса
	 */
	public updateDelivery(address: string): void {
		this.state.address = address;
		this.validate();
		this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_SET, { address });
	}

	/**
	 * Обновляет способ оплаты и выполняет валидацию
	 * @public
	 * @param {PaymentMethod} method - Выбранный способ оплаты
	 * @emits AppEvents.ORDER_PAYMENT_SET - При обновлении способа оплаты
	 */
	public updatePayment(method: PaymentMethod): void {
		this.state.payment = method;
		this.validate();
		this.eventEmitter.emit(AppEvents.ORDER_PAYMENT_SET, { method });
	}

	/**
	 * Обновляет email и выполняет валидацию
	 * @public
	 * @param {string} email - Введенный email
	 * @emits AppEvents.ORDER_EMAIL_SET - При обновлении email
	 */
	public updateEmail(email: string): void {
		this.state.email = email;
		this.validate();
		this.eventEmitter.emit(AppEvents.ORDER_EMAIL_SET, { email });
	}

	/**
	 * Обновляет телефон и выполняет валидацию
	 * @public
	 * @param {string} phone - Введенный телефон
	 * @emits AppEvents.ORDER_PHONE_SET - При обновлении телефона
	 */
	public updatePhone(phone: string): void {
		this.state.phone = phone;
		this.validate();
		this.eventEmitter.emit(AppEvents.ORDER_PHONE_SET, { phone });
	}

	/**
	 * Проверяет валидность данных формы заказа
	 * @private
	 * @emits AppEvents.ORDER_VALIDATION_ERROR - При наличии ошибок валидации
	 */
	private validate(): void {
		const isDeliveryValid = !!this.state.address && !!this.state.payment;
		const isContactsValid = !!this.state.email && !!this.state.phone;

		this.state.isValid = isDeliveryValid && isContactsValid;
		this.state.errors = [];

		if (!this.state.address) {
			this.state.errors.push({
				field: 'address',
				message: 'Введите адрес доставки'
			});
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'address',
				message: 'Введите адрес доставки'
			});
		}

		if (!this.state.payment) {
			this.state.errors.push({
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'payment',
				message: 'Выберите способ оплаты'
			});
		}

		if (!this.state.email) {
			this.state.errors.push({
				field: 'email',
				message: 'Введите email'
			});
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'email',
				message: 'Введите email'
			});
		}

		if (!this.state.phone) {
			this.state.errors.push({
				field: 'phone',
				message: 'Введите телефон'
			});
			this.eventEmitter.emit(AppEvents.ORDER_VALIDATION_ERROR, {
				field: 'phone',
				message: 'Введите телефон'
			});
		}
	}

	/**
	 * Возвращает текущее состояние формы заказа
	 * @public
	 * @returns {IOrderFormState} Текущее состояние формы заказа
	 */
	public getState(): IOrderFormState {
		return this.state;
	}
}