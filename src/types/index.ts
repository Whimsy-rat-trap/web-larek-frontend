export interface ICardActions {
	onClick?: (event: MouseEvent) => void;
}

/**
 * Класс, представляющий товар/продукт
 * @class
 */
export class Product {
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
 * Класс, представляющий ответ со списком товаров
 * @class
 */
export class ProductListResponse {
	/**
	 * Создает экземпляр ProductListResponse
	 * @param {number} total - Общее количество товаров
	 * @param {Product[]} items - Массив товаров
	 */
	constructor(
		public readonly total: number,
		public readonly items: Product[]
	) {}
}

/**
 * Доступные способы оплаты
 */
export type PaymentMethod = 'online' | 'on_delivery';

/**
 * Информация об оформленном заказе
 */
export class OrderSubmitResult {
	/**
	 * Идентификатор заказа
	 */
	public readonly id: string;

	/**
	 * Сумма заказа
	 */
	public readonly total: number;
}
