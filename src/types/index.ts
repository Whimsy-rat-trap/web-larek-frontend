/**
 * Класс, представляющий товар/продукт
 * @class
 */
class Product {
	/**
	 * Уникальный идентификатор продукта
	 * @type {string}
	 */
	id!: string;

	/**
	 * URL изображения продукта
	 * @type {string}
	 */
	image!: string;

	/**
	 * Название продукта
	 * @type {string}
	 */
	title!: string;

	/**
	 * Категория продукта
	 * @type {string}
	 */
	category!: string;

	/**
	 * Цена продукта (`null` если цена не установлена)
	 * @type {?number}
	 */
	price!: number | null;

	/**
	 * Описание продукта (необязательное поле).
	 * @type {string|undefined}
	 */
	description?: string;
}

/**
 * Класс, представляющий элемент корзины.
 * @class
 */
class BasketItem {
	/**
	 * Уникальный идентификатор товара.
	 * @type {string}
	 */
	productId!: string;

	/**
	 * Название товара.
	 * @type {string}
	 */
	name!: string;

	/**
	 * Цена товара за единицу.
	 * @type {number}
	 */
	price!: number;

	/**
	 * Количество товара. По умолчанию 1.
	 * @type {number}
	 * @default 1
	 */
	quantity = 1;
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
	items!: BasketItem[];

	/**
	 * Общая сумма заказа
	 * @type {number}
	 */
	total!: number;
}

/**
 * Класс, представляющий заказ
 * @class
 */
class Order {
	/**
	 * Способ оплаты
	 * @type {'online' | 'on_delivery'}
	 */
	payment!: 'online' | 'on_delivery';

	/**
	 * Адрес доставки
	 * @type {string}
	 */
	address!: string;

	/**
	 * Email покупателя для уведомлений
	 * @type {string}
	 */
	email!: string;

	/**
	 * Контактный телефон покупателя
	 * @type {string}
	 */
	phone!: string;

	/**
	 * Итоговая сумма заказа
	 * @type {number}
	 */
	total!: number;

	/**
	 * Массив идентификаторов товаров
	 * @type {string[]}
	 */
	items!: string[];
}

/**
 * Класс, представляющий успешно оформленный заказ
 * @class
 */
class SuccessfulOrderResponse {
	/**
	 * Уникальный идентификатор заказа
	 * @type {string}
	 */
	id!: string;

	/**
	 * Итоговая сумма заказа
	 * @type {number}
	 */
	total!: number;
}

/**
 * Класс, представляющий ответ со списком товаров
 * @class
 */
class ProductListResponse {
	/**
	 * Общее количество товаров
	 * @type {number}
	 */
	total!: number;

	/**
	 * Массив товаров
	 * @type {Product[]}
	 */
	items!: Product[];
}