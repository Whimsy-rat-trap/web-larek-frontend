import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { IProduct } from "../../types";
import { AppState } from "./AppState";

export class CartService {
	private eventEmitter: EventEmitter;
	private appState: AppState;

	constructor(eventEmitter: EventEmitter, appState: AppState) {
		this.eventEmitter = eventEmitter;
		this.appState = appState;
		this.setupEventListeners();
	}

	private setupEventListeners() {
		this.eventEmitter.on(AppEvents.MODAL_PRODUCT_CART_ITEM_ADDED,
			(data: { id: string }) => this.addToCart(data.id));
		this.eventEmitter.on(AppEvents.MODAL_CART_ITEM_REMOVED,
			(data: { id: string }) => this.removeFromCart(data.id));
		this.eventEmitter.on(AppEvents.ORDER_SUBMITTED,
			() => this.clearCart());
	}

	addToCart(productId: string): void {
		const product = this.appState.state.catalog.find(p => p.id === productId);
		if (!product || !product.price) return;

		if (!this.appState.state.basket.some(item => item.id === productId)) {
			this.appState.basket = [...this.appState.state.basket, product];
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADDED, { id: productId });
			this.eventEmitter.emit(AppEvents.CART_UPDATED);
		} else {
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADD_ERROR, { id: productId });
		}
	}

	removeFromCart(productId: string): void {
		this.appState.basket = this.appState.state.basket
			.filter(item => item.id !== productId);
		this.eventEmitter.emit(AppEvents.CART_ITEM_REMOVED, { id: productId });
		this.eventEmitter.emit(AppEvents.CART_UPDATED);
	}

	clearCart(): void {
		this.appState.basket = [];
		this.eventEmitter.emit(AppEvents.CART_CLEAR);
		this.eventEmitter.emit(AppEvents.CART_UPDATED);
	}

	getCartItems(): IProduct[] {
		return this.appState.state.basket;
	}

	getTotalPrice(): number {
		return this.appState.state.basket
			.reduce((total, item) => total + (item.price || 0), 0);
	}
}