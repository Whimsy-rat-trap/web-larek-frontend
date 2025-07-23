import { EventEmitter } from "../base/events";
import { AppEvents } from "../../utils/events";
import { IBasketState } from "../../types";

export class CartService {
	private eventEmitter: EventEmitter;
	private state: IBasketState;

	constructor(eventEmitter: EventEmitter) {
		this.eventEmitter = eventEmitter;
		this.state = {
			items: [],
			total: 0
		};

		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED, (data: { id: string }) =>
			this.addToCart(data.id));
		this.eventEmitter.on(AppEvents.MODAL_CART_ITEM_REMOVED, (data: { id: string }) =>
			this.removeFromCart(data.id));
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_PAYMENT_CLICKED, () =>
			this.clearCart());
	}

	addToCart(productId: string) {
		if (!this.state.items.includes(productId)) {
			this.state.items.push(productId);
			this.updateCart();
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADDED, { id: productId });
		} else {
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADD_ERROR, { id: productId });
		}
	}

	removeFromCart(productId: string) {
		this.state.items = this.state.items.filter(id => id !== productId);
		this.updateCart();
		this.eventEmitter.emit(AppEvents.CART_ITEM_REMOVED, { id: productId });
	}

	clearCart() {
		this.state.items = [];
		this.state.total = 0;
		this.eventEmitter.emit(AppEvents.CART_CLEAR);
	}

	private updateCart() {
		// Здесь будет логика пересчета общей стоимости
		this.eventEmitter.emit(AppEvents.CART_UPDATED, this.state);
	}

	getState(): IBasketState {
		return this.state;
	}
}