import { IModel } from '../../interfaces/IModel';
import { Basket } from './Basket';
import { Catalog } from './Catalog';
import { Order } from './Order';
import { Api } from '../base/api';

export class AppData implements IModel {
	public readonly catalog: Catalog;
	public readonly basket: Basket;
	public readonly order: Order;

	constructor(api:Api	) {
		this.catalog = new Catalog(api);
		this.basket = new Basket();
		this.order = new Order(api);
	}
}
