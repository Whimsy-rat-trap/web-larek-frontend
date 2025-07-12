import { PaymentMethod, Product } from '../../types';
import { IModel } from '../../interfaces/IModel';
import { EventEmitter } from '../base/events';

type OrderData = {
	products: Product[],
	paymentMethod: PaymentMethod,
	address: string,
	email: string,
	phone: string,
	total: number,
};

/**
 * Модель заказа
 */
export class Order extends EventEmitter implements IModel {
	protected _data: OrderData = {
		products: [],
		paymentMethod: 'online',
		address: '',
		email: '',
		phone: '',
		total: 0,
	};

	get data(): OrderData {
		return this._data;
	}

	set products(products: Product[]) {
		this._data.products = products;
		this._data.total = this._data.products.reduce(
			(total, item) => total + item.price,
			0
		);
		this.emit('order:changed', this._data);
	}

	set paymentMethod(paymentMethod: PaymentMethod) {
		this._data.paymentMethod = paymentMethod;
		this.emit('order:changed', this._data);
	}

	set address(address: string) {
		this._data.address = address;
		this.emit('order:changed', this._data);
	}

	set email(email: string) {
		this._data.email = email;
		this.emit('order:changed', this._data);
	}

	set phone(phone: string) {
		this._data.phone = phone;
		this.emit('order:changed', this._data);
	}
}
