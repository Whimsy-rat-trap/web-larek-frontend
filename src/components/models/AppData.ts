import { Product, IOrder } from '../../types';
import { Api } from '../base/api';

export class AppData {
    protected _basket: string[] = [];
    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        items: [],
        total: 0
    };

	constructor(protected api: Api) {}

	get basket(): string[] {
        return this._basket;
    }

    get order(): IOrder {
        return this._order;
    }

    // Добавляем товары в корзину
    addToBasket(item: Product) {
        if (!this._basket.includes(item.id)) {
            this._basket.push(item.id);
        }
    }

    // Удаляем товары из корзины
    removeFromBasket(id: string) {
        this._basket = this._basket.filter(item => item !== id);
    }

    // Очищаем корзину
    clearBasket() {
        this._basket = [];
    }

    // Оформление заказа
    async submitOrder(order: IOrder): Promise<{id: string, total: number}> {
        try {
            return await this.api.post('/order', order) as {id: string, total: number};
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            throw error;
        }
    }
}