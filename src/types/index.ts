import {ensureElement} from '../utils/utils';

const mainModalContainer = ensureElement<HTMLElement>('.main-modal-container');
const productModal = ensureElement<HTMLElement>('.product-modal');
const basketModal = ensureElement<HTMLElement>('.basket-modal');
const paymentModal = ensureElement<HTMLElement>('.payment-modal');
const contactsModal = ensureElement<HTMLElement>('.contacts-modal');
const successModal = ensureElement<HTMLElement>('.success-modal');

/**
 * Класс, представляющий товар/продукт
 * @class
 */
class Product {
	/**
	 * Создает экземпляр Product
	 * @param {string} id - Уникальный идентификатор продукта
	 * @param {string} image - URL изображения продукта
	 * @param {string} title - Название продукта
	 * @param {string} category - Категория продукта
	 * @param {number|null} price - Цена продукта
	 * @param {string} [description] - Описание продукта
	 */
	constructor(
		public readonly id: string,
		public readonly image: string,
		public readonly title: string,
		public readonly category: string,
		public readonly price: number | null,
		public readonly description?: string
	) {}
}

/**
 * Класс, представляющий элемент корзины
 * @class
 */
class BasketItem {
	/**
	 * Создает экземпляр BasketItem
	 * @param {string} productId - ID товара
	 * @param {string} name - Название товара
	 * @param {number} price - Цена за единицу
	 */
	constructor(
		public readonly productId: string,
		public readonly name: string,
		public readonly price: number
	) {}
}

/**
 * Класс, представляющий корзину покупок
 * @class
 */
class Basket {
	/**
	 * Массив элементов в корзине
	 * @type {BasketItem[]}
	 */
	private items: BasketItem[] = [];

	/**
	 * Общая сумма заказа
	 * @type {number}
	 */
	private total = 0;

	addItem(product: Product): void {
		// Проверяем, что у товара указана цена
		if (product.price === null) {
			console.warn(`Товар "${product.title}" не может быть добавлен в корзину - цена не указана`);
			return;
		}
		// Создаем новый элемент корзины
		const newItem = new BasketItem(
			product.id,
			product.title,
			product.price
		);

		//Добавляем его в массив товаров
		this.items.push(newItem);

		//Пересчитываем счумму
		this.calculateTotal();
	}

	removeItem(productId: string): boolean {
		//сохранение числа элементов в корзине до удаления
		const initialLength = this.items.length;
		//фильтруем только те товары у которых productId не равен удаляемому
		this.items = this.items.filter(item => item.productId !== productId);
		this.calculateTotal();
		return this.items.length !== initialLength; // Возвращает true, если элемент был удален
	}

	/**
	 * Отправляет заказ и логирует процесс
	 * @param {Order} order - Данные заказа
	 */
	submitOrder(order: Order): void {
		console.log('Заказ успешно оформлен!');
		console.log(`Сумма к оплате: ${order.total} синапсов`);
	}

	//список товаров
	getItems(): BasketItem[] {
		return this.items;
	}

	//общая сумма
	getTotal(): number {
		return this.total;
	}

	calculateTotal() {
		this.total = this.items.reduce((sum, item) => sum + item.price, 0);
	}
}

/**
 * Класс, представляющий заказ
 * @class
 */
class Order {
	/**
	 * Создает экземпляр Order
	 * @param {'online'|'on_delivery'} payment - Способ оплаты
	 * @param {string} address - Адрес доставки
	 * @param {string} email - Email покупателя
	 * @param {string} phone - Телефон покупателя
	 * @param {number} total - Итоговая сумма
	 * @param {string[]} items - Список ID товаров
	 */
	constructor(
		public readonly payment: 'online' | 'on_delivery',
		public readonly address: string,
		public readonly email: string,
		public readonly phone: string,
		public readonly total: number,
		public readonly items: string[]
	) {
	}
}

/**
 * Класс, представляющий успешно оформленный заказ
 * @class
 */
class SuccessfulOrderResponse {
	/**
	 * Создает экземпляр SuccessfulOrderResponse
	 * @param {string} id - ID заказа
	 * @param {number} total - Итоговая сумма
	 */
	constructor(
		public readonly id: string,
		public readonly total: number
	) {}
}

/**
 * Класс, представляющий ответ со списком товаров
 * @class
 */
class ProductListResponse {
	/**
	 * Создает экземпляр ProductListResponse
	 * @param {number} total - Общее количество товаров
	 * @param {Product[]} items - Массив товаров
	 */
	constructor(
		public readonly total: number,
		public readonly items: Product[]
	) {
	}
}