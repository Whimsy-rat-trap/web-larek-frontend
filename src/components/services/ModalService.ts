import { EventEmitter } from "../base/events";
import { AppEvents } from "../../utils/events";
import { IModalState } from "../../types";

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

	private openCartModal(): void {
		this.state.isOpened = true;
		this.state.type = 'cart';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'cart' });
	}

	private openProductModal(productId: string): void {
		this.state.isOpened = true;
		this.state.type = 'product';
		this.state.productId = productId;
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'product', productId });
	}

	private openOrderModal(): void {
		this.state.isOpened = true;
		this.state.type = 'order';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'order' });
	}

	private openContactsModal(): void {
		this.state.isOpened = true;
		this.state.type = 'contacts';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'contacts' });
	}

	private openSuccessModal(): void {
		this.state.isOpened = true;
		this.state.type = 'success';
		this.eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'success' });
	}

	public closeModal(): void {
		this.state.isOpened = false;
		this.state.type = null;
		this.state.productId = null;
	}
}