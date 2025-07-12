import { IModel } from '../../interfaces/IModel';
import { Product } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class Catalog implements IModel {
	protected _items: Product[] = [];

	constructor(protected api: Api) {}

	get items(): Product[] {
		return this._items;
	}

	// Загрузка товаров
	async getProducts(): Promise<Product[]> {
		try {
			const response = (await this.api.get(
				'/product'
			)) as ApiListResponse<Product>;
			this._items = response.items;
			return response.items;
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
			throw error;
		}
	}
}
