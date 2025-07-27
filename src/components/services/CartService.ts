import { EventEmitter } from "../base/events";
import { AppEvents } from "../../types/events";
import { ICart, IProduct } from "../../types";
import { AppState } from "./AppState";

export class CartService {
	private eventEmitter: EventEmitter;
	private cart: ICart;
	private appState: AppState;

	constructor(eventEmitter: EventEmitter, appState: AppState) {
		this.eventEmitter = eventEmitter;
		this.appState = appState;
		this.cart = {
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
		const product = this.appState.state.catalog.find(p => p.id === productId);
		if (!product || !product.price) return;

		if (!this.cart.items.some(item => item.id === productId)) {
			this.cart.items.push({
				id: product.id,
				title: product.title,
				price: product.price
			});
			this.updateCart();
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADDED, { id: productId });
		} else {
			this.eventEmitter.emit(AppEvents.CART_ITEM_ADD_ERROR, { id: productId });
		}
	}

	removeFromCart(productId: string) {
		const itemIndex = this.cart.items.findIndex(item => item.id === productId);
		if (itemIndex !== -1) {
			this.cart.items.splice(itemIndex, 1);
			this.updateCart();
			this.eventEmitter.emit(AppEvents.CART_ITEM_REMOVED, { id: productId });
		}
	}

	clearCart() {
		this.cart.items = [];
		this.cart.total = 0;
		this.eventEmitter.emit(AppEvents.CART_CLEAR);
	}

	private updateCart() {
		this.cart.total = this.cart.items.reduce((total, item) => total + item.price, 0);
		this.eventEmitter.emit(AppEvents.CART_UPDATED, this.cart);
	}

	getCart(): ICart {
		return this.cart;
	}

	getItemById(id: string): IProduct | undefined {
		return this.appState.state.catalog.find(p => p.id === id);
	}
}