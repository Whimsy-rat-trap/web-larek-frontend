import { IOrder } from '../../types';
import { Api } from '../base/api';
import { IModel } from '../../interfaces/IModel';

export class Order implements IModel{
    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        items: [],
        total: 0
    };

	constructor(protected api: Api) {}

    get order(): IOrder {
        return this._order;
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