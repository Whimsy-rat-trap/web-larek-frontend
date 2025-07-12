import { Product } from '../../types';
import { Api, ApiListResponse } from '../base/api';
import { ICatalogModel } from '../../interfaces/models/ICatalogModel';

export class Catalog implements ICatalogModel {
	protected _products: Product[] = [];

	constructor(protected api: Api) {}

	get products(): Product[] {
		return this._products;
	}

	// Загрузка товаров
	async getProducts(): Promise<Product[]> {
		try {
			const response = (await this.api.get(
				'/product'
			)) as ApiListResponse<Product>;
			this._products = response.items;
			return response.items;
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
			throw error;
		}
	}
}
