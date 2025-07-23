// Тип для способов оплаты (на основе примера)
export type PaymentMethod = 'online' | 'cash';

// Интерфейс товара (из GET запросов)
export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description: string;
	category: string;
	image: string;
}

// Интерфейс корзины
export interface ICart {
	items: string[];   // Массив товаров
	total: number;
}

// Данные для оформления заказа (POST Order)
export interface IOrderRequest {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];   // Массив товаров
}

// Ответ сервера на заказ
export interface IOrderResponse {
	id: string;
	total: number;
}

// Тип для данных формы
export type OrderFormData = Omit<IOrderRequest, 'total' | 'items'>;

//Модель ошибки валидации
export interface IValidationError {
	field: 'address' | 'email' | 'phone' | 'payment';
	message: string;
}

//Модель состояния API
export interface IApiState {
	isLoading: boolean;
	lastUpdated: number | null;
}

// Модель состояния модальных окон
export interface IModalState {
	isOpened: boolean;
	type: 'product' | 'cart' | 'order' | 'contacts' | 'success' | null;
	productId: string | null;
}

// Модель состояния формы заказа
export interface IOrderFormState {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
	isValid: boolean; // Убрал valid, оставил только isValid
	errors: IValidationError[];
}

// Состояние приложения
export interface IAppState {
	catalog: IProduct[];
	basket: string[];
	order: IOrderFormState;
	preview: string | null;
}

// Модель для отображения товара в корзине
export interface IBasketItem {
	id: string;
	title: string;
	price: number;
	index: number;
}

// Модель состояния корзины
export interface IBasketState {
	items: string[];
	total: number;
}
