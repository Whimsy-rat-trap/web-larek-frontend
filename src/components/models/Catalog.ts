import { Product } from '../../types';
import { ICatalogModel } from '../../interfaces/models/ICatalogModel';
import { EventEmitter } from '../base/events';

export class Catalog extends EventEmitter implements ICatalogModel {
	protected _products: Product[] = [];

	get products(): Product[] {
		return [...this._products];
	}

	set products(products: Product[]) {
		this._products = products;
		this.emit('catalog:changed', this._products);
	}
}
