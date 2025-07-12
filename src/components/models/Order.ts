import { PaymentMethod, Product, OrderSubmitResult } from '../../types';
import { Api } from '../base/api';
import { IModel } from '../../interfaces/IModel';

/**
 * Модель заказа
 */
export class Order implements IModel {
	protected _products: Product[] = [];
	protected _paymentMethod: PaymentMethod = 'online';
	protected _address = '';
	protected _email = '';
	protected _phone = '';

	constructor(protected api: Api) {}

	get products(): Product[] {
		return this._products;
	}
	set products(products: Product[]) {
		this._products = products;
	}

	get paymentMethod(): PaymentMethod {
		return this._paymentMethod;
	}
	set paymentMethod(paymentMethod: PaymentMethod) {
		this._paymentMethod = paymentMethod;
	}

	get address(): string {
		return this._address;
	}
	set address(address: string) {
		this._address = address;
	}

	get email(): string {
		return this._email;
	}
	set email(email: string) {
		this._email = email;
	}

	get phone(): string {
		return this._phone;
	}
	set phone(phone: string) {
		this._phone = phone;
	}

	/**
	 * Вычисляет и возвращает общую стоимость всех товаров в заказе
	 * @returns {number} Общая стоимость товаров
	 */
	get total(): number {
		return this._products.reduce((total, item) => total + item.price, 0);
	}

	// Оформление заказа
	async submit(): Promise<OrderSubmitResult> {
		try {
			const orderData = {
				payment: this._paymentMethod,
				email: this._email,
				phone: this._phone,
				address: this._address,
				items: this._products.map(item => item.id),
				total: this.total,
			}
			return (await this.api.post('/order', orderData)) as {
				id: string;
				total: number;
			};
		} catch (error) {
			console.error('Ошибка оформления заказа:', error);
			throw error;
		}
	}
}
