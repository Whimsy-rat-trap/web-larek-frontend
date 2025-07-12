import { IModel } from '../../interfaces/IModel';
import { Product } from '../../types';

/**
 * Класс, представляющий корзину покупок
 * @class
 * @implements {IModel}
 */
export class Basket implements IModel {
	/**
	 * Массив товаров в корзине
	 * @type {Product[]}
	 * @protected
	 */
	protected _items: Product[] = [];

	/**
	 * Получает массив товаров в корзине
	 * @returns {Product[]} Массив товаров
	 */
	get items(): Product[] {
		return this._items;
	}
	
	/**
	 * Вычисляет и возвращает общую стоимость всех товаров в корзине
	 * @returns {number} Общая стоимость товаров
	 */
	get total(): number {
		return this._items.reduce((total, item) => total + item.price, 0);
	}

	/**
	 * Добавляет товар в корзину
	 * @param {Product} item - Товар для добавления
	 * @description Если товар уже есть в корзине, он не будет добавлен повторно
	 */
	add(item: Product) {
		if (!this._items.includes(item)) {
			this._items.push(item);
		}
	}

	/**
	 * Удаляет товар из корзины по его идентификатору
	 * @param {string} id - Идентификатор товара для удаления
	 */
	remove(id: string) {
		this._items = this._items.filter((item) => item.id !== id);
	}

	/**
	 * Полностью очищает корзину, удаляя все товары
	 */
	clear() {
		this._items = [];
	}
}