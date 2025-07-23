import { Api } from "../base/api";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";
import { AppEvents } from "../../utils/events";
import { EventEmitter } from "../base/events";

interface IProductListResponse {
	total: number;
	items: IProduct[];
}

export class ApiService {
	constructor(private api: Api, private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.PAGE_MAIN_LOADED, () => this.loadProducts());
		this.eventEmitter.on(AppEvents.PRODUCT_DETAILS_REQUESTED, (data: { id: string }) =>
			this.loadProductDetails(data.id));
		this.eventEmitter.on(AppEvents.ORDER_READY, (data: IOrderRequest) =>
			this.submitOrder(data));
	}

	private async loadProducts(): Promise<void> {
		try {
			const response = await this.api.get('/product') as IProductListResponse;
			this.eventEmitter.emit(AppEvents.PRODUCTS_LIST_LOADED, { items: response.items });
		} catch (error) {
			console.error('Failed to load products:', error);
		}
	}

	private async loadProductDetails(productId: string): Promise<void> {
		try {
			const response = await this.api.get(`/product/${productId}`) as IProduct;
			this.eventEmitter.emit(AppEvents.PRODUCT_DETAILS_LOADED, response);
		} catch (error) {
			console.error('Failed to load product details:', error);
		}
	}

	private async submitOrder(orderData: IOrderRequest): Promise<void> {
		this.eventEmitter.emit(AppEvents.ORDER_SENT);

		try {
			const response = await this.api.post('/order', orderData) as IOrderResponse;
			this.eventEmitter.emit(AppEvents.ORDER_SUBMITTED, response);
		} catch (error) {
			console.error('Failed to submit order:', error);
		}
	}
}