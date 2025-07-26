import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IBasketState, IProduct } from "../../types";
import { AppState } from "./AppState";

export class CartService {
	private eventEmitter: EventEmitter;
	private state: IBasketState;
	private appState: AppState;

	constructor(eventEmitter: EventEmitter, appState: AppState) {
		this.eventEmitter = eventEmitter;
		this.appState = appState;
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
		// Пересчитываем общую стоимость
		this.state.total = this.state.items.reduce((total, id) => {
			const product = this.appState.state.catalog.find(p => p.id === id);
			return total + (product?.price || 0);
		}, 0);

		this.eventEmitter.emit(AppEvents.CART_UPDATED, this.state);
	}

	getState(): IBasketState {
		return this.state;
	}

	getProductById(id: string): IProduct | undefined {
		return this.appState.state.catalog.find(p => p.id === id);
	}
}