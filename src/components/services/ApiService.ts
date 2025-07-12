import { Api, ApiListResponse } from '../base/api';
import { OrderSubmitResult, Product } from '../../types';
import { Order } from '../models/Order';
import { API_URL } from '../../utils/constants';

export class ApiService {
	private api: Api;
	constructor() {
		this.api = new Api(API_URL);
	}

	async getProducts(): Promise<Product[]> {
		try {
			const response = (await this.api.get(
				'/product'
			)) as ApiListResponse<Product>;
			return response.items;
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
			throw error;
		}
	}

	async submitOrder(order: Order): Promise<OrderSubmitResult> {
		try {
			const orderData = {
				payment: order.data.paymentMethod,
				email: order.data.email,
				phone: order.data.phone,
				address: order.data.address,
				items: order.data.products.map(item => item.id),
				total: order.data.total,
			}
			return (await this.api.post('/order', orderData)) as OrderSubmitResult;
		} catch (error) {
			console.error('Ошибка оформления заказа:', error);
			throw error;
		}
	}
}
