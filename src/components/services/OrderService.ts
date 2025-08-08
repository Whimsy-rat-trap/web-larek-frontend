import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IOrderRequest, PaymentMethod } from '../../types';
import { AppStateModal } from '../models/AppStateModal';

/**
 * Сервис для обработки логики оформления заказа
 * @class OrderService
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {AppStateModal} appState - Состояние приложения
 */
export class OrderService {
	/**
	 * Создает экземпляр OrderService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 * @param {AppStateModal} appState - Состояние приложения
	 */
	constructor(
		private eventEmitter: EventEmitter,
		private appState: AppStateModal
	) {
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для сервиса заказов
	 * @private
	 * @listens AppEvents.UI_ORDER_BUTTON_START_CLICKED - При начале оформления заказа
	 * @listens AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - При переходе к следующему шагу
	 * @listens AppEvents.UI_ORDER_BUTTON_PAY_CLICKED - При подтверждении оплаты
	 */
	private setupEventListeners(): void {
		// Инициализация заказа
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () => {
			this.eventEmitter.emit(AppEvents.ORDER_INITIATED);
		});

		// Подготовка заказа при переходе к контактам
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () => {
			this.prepareOrder('delivery');
		});

		// Финальная проверка перед оплатой
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAY_CLICKED, () => {
			this.prepareOrder('payment');
		});
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
			// Проверяем isValid перед отправкой
			if (this.appState.state.order.isValid) {
				const orderData: IOrderRequest = {
					payment: this.appState.state.order.payment,
					address: this.appState.state.order.address,
					email: this.appState.state.order.email,
					phone: this.appState.state.order.phone,
					total: 0, // ApiService пересчитает
					items: []  // ApiService добавит
				};
				this.eventEmitter.emit(AppEvents.ORDER_READY, orderData);
			}
		} else {
			// Шаг delivery (переход к контактам)
			this.eventEmitter.emit(AppEvents.ORDER_DELIVERY_COMPLETED);
		}
	}
}