/**
 * Тип, представляющий доступные способы оплаты
 * @typedef {'online' | 'cash'} PaymentMethod
 */
export type PaymentMethod = 'online' | 'cash';

/**
 * Интерфейс товара, получаемого с сервера
 * @interface IProduct
 * @property {string} id - Уникальный идентификатор товара
 * @property {string} title - Название товара
 * @property {number|null} price - Цена товара (может быть null)
 * @property {string} description - Описание товара
 * @property {string} category - Категория товара
 * @property {string} image - URL изображения товара
 */
export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description: string;
	category: string;
	image: string;
}

/**
 * Интерфейс данных для отправки заказа на сервер
 * @interface IOrderRequest
 * @property {PaymentMethod} payment - Выбранный способ оплаты
 * @property {string} email - Email покупателя
 * @property {string} phone - Телефон покупателя
 * @property {string} address - Адрес доставки
 * @property {number} total - Общая сумма заказа
 * @property {string[]} items - Массив идентификаторов товаров в заказе
 */
export interface IOrderRequest {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

/**
 * Интерфейс ответа сервера на оформление заказа
 * @interface IOrderResponse
 * @property {string} id - Идентификатор созданного заказа
 * @property {number} total - Общая сумма заказа
 */
export interface IOrderResponse {
	id: string;
	total: number;
}

/**
 * Тип данных формы заказа (исключает поля total и items из IOrderRequest)
 * @typedef {Omit<IOrderRequest, 'total' | 'items'>} OrderFormData
 */
export type OrderFormData = Omit<IOrderRequest, 'total' | 'items'>;

/**
 * Интерфейс ошибки валидации формы
 * @interface IValidationError
 * @property {'address' | 'email' | 'phone' | 'payment'} field - Поле, в котором обнаружена ошибка
 * @property {string} message - Сообщение об ошибке
 */
export interface IValidationError {
	field: 'address' | 'email' | 'phone' | 'payment';
	message: string;
}

/**
 * Интерфейс состояния API-запросов
 * @interface IApiState
 * @property {boolean} isLoading - Флаг выполнения запроса
 * @property {number|null} lastUpdated - Время последнего обновления данных (timestamp)
 */
export interface IApiState {
	isLoading: boolean;
	lastUpdated: number | null;
}

/**
 * Интерфейс состояния модальных окон
 * @interface IModalState
 * @property {boolean} isOpened - Флаг открытия модального окна
 * @property {'product' | 'cart' | 'order' | 'contacts' | 'success' | null} type - Тип открытого модального окна
 * @property {string|null} productId - Идентификатор товара (для модального окна товара)
 */
export interface IModalState {
	isOpened: boolean;
	type: 'product' | 'cart' | 'order' | 'contacts' | 'success' | null;
	productId: string | null;
}

/**
 * Интерфейс состояния формы заказа
 * @interface IOrderFormState
 * @property {PaymentMethod|null} payment - Выбранный способ оплаты
 * @property {string} address - Введенный адрес доставки
 * @property {string} email - Введенный email
 * @property {string} phone - Введенный телефон
 * @property {boolean} isValid - Флаг валидности всей формы
 * @property {IValidationError[]} errors - Массив ошибок валидации
 */
export interface IOrderFormState {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
	isValid: boolean;
	errors: IValidationError[];
}

/**
 * Интерфейс общего состояния приложения
 * @interface IAppState
 * @property {IProduct[]} catalog - Список товаров в каталоге
 * @property {string[]} basket - Идентификаторы товаров в корзине
 * @property {IOrderFormState} order - Состояние формы заказа
 * @property {string|null} preview - Идентификатор товара для предпросмотра
 */
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	basketTotal: number;
	order: IOrderFormState;
	preview: string | null;
}

/**
 * Интерфейс сервиса корзины для SuccessModal
 * @interface ICartServiceForSuccess
 * @property {() => number} getTotalPrice - Получить сумму корзины
 * @property {() => void} clearCart - Очистить корзину
 */
export interface ICartServiceForSuccess {
	getTotalPrice(): number;
	clearCart(): void;
}