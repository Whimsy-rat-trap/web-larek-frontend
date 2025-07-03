import { Api } from './base/api';
import { IAppState, Product, IOrder } from '../types';
import { ApiListResponse } from '../types';

export class AppData {
    protected _catalog: Product[] = [];
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

    setCatalog(items: Product[]) {
        this._catalog = items;
    }

    get catalog(): Product[] {
        return this._catalog;
    }

    get basket(): string[] {
        return this._basket;
    }

    get order(): IOrder {
        return this._order;
    }

    // Загрузка товаров
    async getProducts(): Promise<Product[]> {
        try {
            const data = await this.api.get('/product') as ApiListResponse<Product>;
            this.setCatalog(data.items);
            return data.items;
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            throw error;
        }
    }
}