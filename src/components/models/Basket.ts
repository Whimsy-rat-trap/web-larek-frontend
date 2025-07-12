import { IModel } from '../../interfaces/IModel';
import { Product } from '../../types';

export class Basket implements IModel {
	protected _items: string[] = [];

	get items(): string[] {
		return this._items;
	}

	// Добавляем товары в корзину
	add(item: Product) {
		if (!this._items.includes(item.id)) {
			this._items.push(item.id);
		}
	}

	// Удаляем товары из корзины
	remove(id: string) {
		this._items = this._items.filter((item) => item !== id);
	}

	// Очищаем корзину
	clear() {
		this._items = [];
	}
}
