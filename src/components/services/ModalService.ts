import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IModalState } from "../../types";

/**
 * Сервис управления модальными окнами
 * @class ModalService
 * @property {IModalState} state - Текущее состояние модальных окон
 */
export class ModalService {
	private state: IModalState = {
		isOpened: false,
		type: null,
		productId: null
	};

	constructor(private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.UI_BUTTON_CART_CLICKED, () => this.openCartModal());
		this.eventEmitter.on(AppEvents.PRODUCT_DETAILS_REQUESTED, (data: { id: string }) =>
			this.openProductModal(data.id));
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
	 * @emits AppEvents.MODAL_OPENED С типом 'cart'
	 */
	private openCartModal(): void {
		this.state.isOpened = true;
		this.state.type = 'cart';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'cart' });
	}

	/**
	 * Открывает модальное окно товара
	 * @private
	 * @param {string} productId - ID товара
	 * @emits AppEvents.MODAL_OPENED С типом 'product'
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
	 * @emits AppEvents.MODAL_OPENED С типом 'order'
	 */
	private openOrderModal(): void {
		this.state.isOpened = true;
		this.state.type = 'order';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'order' });
	}

	/**
	 * Открывает модальное окно контактов
	 * @private
	 * @emits AppEvents.MODAL_OPENED С типом 'contacts'
	 */
	private openContactsModal(): void {
		this.state.isOpened = true;
		this.state.type = 'contacts';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'contacts' });
	}

	/**
	 * Открывает модальное окно успешного заказа
	 * @private
	 * @emits AppEvents.MODAL_OPENED С типом 'success'
	 */
	private openSuccessModal(): void {
		this.state.isOpened = true;
		this.state.type = 'success';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'success' });
	}

	/**
	 * Закрывает текущее модальное окно и сбрасывает его состояние
	 * @public
	 * @emits AppEvents.MODAL_CLOSED
	 */
	public closeModal(): void {
		this.state.isOpened = false;
		this.state.type = null;
		this.state.productId = null;
	}
}