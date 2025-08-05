import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IModalState } from "../../types";

/**
 * Сервис для управления модальными окнами приложения
 * @class ModalService
 * @property {IModalState} state - Текущее состояние модальных окон
 */
export class ModalService {
	private state: IModalState = {
		isOpened: false,
		type: null,
		productId: null
	};

	/**
	 * Создает экземпляр ModalService
	 * @constructor
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для управления модальными окнами
	 * @private
	 * @listens AppEvents.UI_BUTTON_BASKET_CLICKED - Открывает модальное окно корзины
	 * @listens AppEvents.UI_PRODUCT_CLICKED - Открывает модальное окно товара
	 * @listens AppEvents.UI_ORDER_BUTTON_START_CLICKED - Открывает модальное окно оформления заказа
	 * @listens AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED - Открывает модальное окно контактов
	 * @listens AppEvents.ORDER_SUBMITTED - Открывает модальное окно успешного заказа
	 */
	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.UI_BUTTON_BASKET_CLICKED, () => this.openCartModal());
		this.eventEmitter.on(AppEvents.UI_PRODUCT_CLICKED, (data: { id: string }) => {
			this.eventEmitter.emit(AppEvents.PRODUCT_DETAILS_REQUESTED, data);
			this.openProductModal(data.id);
		});
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () =>
			this.openOrderModal());
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_NEXT_CLICKED, () =>
			this.openContactsModal());
		this.eventEmitter.on(AppEvents.ORDER_SUBMITTED, () =>
			this.openSuccessModal());
	}

	/**
	 * Открывает модальное окно корзины
	 * @private
	 * @emits AppEvents.MODAL_OPENED - С параметрами { type: 'cart' }
	 * @returns {void}
	 */
	private openCartModal(): void {
		this.state.isOpened = true;
		this.state.type = 'cart';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'cart' });
	}

	/**
	 * Открывает модальное окно товара
	 * @private
	 * @param {string} productId - ID товара для отображения
	 * @emits AppEvents.MODAL_OPENED - С параметрами { type: 'product', productId: string }
	 * @returns {void}
	 */
	private openProductModal(productId: string): void {
		this.state.isOpened = true;
		this.state.type = 'product';
		this.state.productId = productId;
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'product', productId });
	}

	/**
	 * Открывает модальное окно оформления заказа
	 * @private
	 * @emits AppEvents.MODAL_OPENED - С параметрами { type: 'order' }
	 * @returns {void}
	 */
	private openOrderModal(): void {
		this.state.isOpened = true;
		this.state.type = 'order';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'order' });
	}

	/**
	 * Открывает модальное окно ввода контактных данных
	 * @private
	 * @emits AppEvents.MODAL_OPENED - С параметрами { type: 'contacts' }
	 * @returns {void}
	 */
	private openContactsModal(): void {
		this.state.isOpened = true;
		this.state.type = 'contacts';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'contacts' });
	}

	/**
	 * Открывает модальное окно успешного оформления заказа
	 * @private
	 * @emits AppEvents.MODAL_OPENED - С параметрами { type: 'success' }
	 * @returns {void}
	 */
	private openSuccessModal(): void {
		this.state.isOpened = true;
		this.state.type = 'success';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'success' });
	}

	/**
	 * Закрывает текущее модальное окно и сбрасывает его состояние
	 * @public
	 * @emits AppEvents.MODAL_CLOSED - При закрытии модального окна
	 * @returns {void}
	 */
	public closeModal(): void {
		this.state.isOpened = false;
		this.state.type = null;
		this.state.productId = null;
		this.eventEmitter.emit(AppEvents.MODAL_CLOSED);
	}
}