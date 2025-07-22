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
	product: boolean;
	cart: boolean;
	checkout: boolean;
	confirmation: boolean;
	currentProductId: string | null;
}

// Модель состояния формы заказа
export interface IOrderFormState {
	address: string;
	email: string;
	phone: string;
	payment: PaymentMethod;
	errors: IValidationError[];
	isValid: boolean;
}