import { Api } from "../base/api";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";
import { AppEvents } from "../../types/events";
import { EventEmitter } from "../base/events";

interface IProductListResponse {
	total: number;
	items: IProduct[];
}

/**
 * Сервис для работы с API магазина
 * @class ApiService
 * @property {Api} api - Экземпляр API клиента
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 */
export class ApiService {
	private _productList: IProduct[] = []; // Модель хранения товаров
	/**
	 * Создает экземпляр ApiService
	 * @param {Api} api - Экземпляр API клиента
	 * @param {EventEmitter} eventEmitter - Эмиттер событий приложения
	 */
	constructor(private api: Api, private eventEmitter: EventEmitter) {
		this.setupEventListeners();
	}

	/**
	 * Получает текущий список товаров
	 */
	get productList(): IProduct[] {
		return this._productList;
	}

	/**
	 * Настраивает обработчики событий для API сервиса
	 * @private
	 * @listens AppEvents.PAGE_MAIN_LOADED При загрузке главной страницы → вызывает loadProducts()
	 * @listens AppEvents.PRODUCT_DETAILS_REQUESTED При запросе деталей товара → вызывает loadProductDetails()
	 * @listens AppEvents.ORDER_READY При готовности заказа → вызывает submitOrder()
	 */
	private setupEventListeners(): void {
		this.eventEmitter.on(AppEvents.PAGE_MAIN_LOADED, () => this.loadProducts());
		this.eventEmitter.on(AppEvents.PRODUCT_DETAILS_REQUESTED, (data: { id: string }) =>
			this.loadProductDetails(data.id));
		this.eventEmitter.on(AppEvents.ORDER_READY, (data: IOrderRequest) =>
			this.submitOrder(data));
	}

	/**
	 * Загружает список товаров с сервера
	 * @private
	 * @emits AppEvents.PRODUCTS_LIST_LOADED При успешной загрузке
	 */
	private async loadProducts(): Promise<void> {
		try {
			const response = await this.api.get('/product') as IProductListResponse;
			this._productList = response.items; // Сохраняем товары в модель
			this.eventEmitter.emit(AppEvents.PRODUCTS_LIST_LOADED, {
				items: this._productList // Отправляем сохраненный список
			});
		} catch (error) {
			console.error('Failed to load products:', error);
			this._productList = []; // Сбрасываем список при ошибке
			this.eventEmitter.emit(AppEvents.PRODUCTS_LIST_LOADED, { items: [] });
		}
	}

	/**
	 * Загружает детали конкретного товара
	 * @private
	 * @param {string} productId - ID товара
	 * @emits AppEvents.PRODUCT_DETAILS_LOADED При успешной загрузке
	 */
	private async loadProductDetails(productId: string): Promise<void> {
		try {
			// Пытаемся найти товар в сохраненном списке
			const cachedProduct = this._productList.find(p => p.id === productId);
			if (cachedProduct) {
				this.eventEmitter.emit(AppEvents.PRODUCT_DETAILS_LOADED, cachedProduct);
				return;
			}

			// Если нет в кеше - загружаем с сервера
			const response = await this.api.get(`/product/${productId}`) as IProduct;
			this.eventEmitter.emit(AppEvents.PRODUCT_DETAILS_LOADED, response);
		} catch (error) {
			console.error('Failed to load product details:', error);
		}
	}

	/**
	 * Отправляет заказ на сервер
	 * @private
	 * @param {IOrderRequest} orderData - Данные заказа
	 * @emits AppEvents.ORDER_SENT При начале отправки
	 * @emits AppEvents.ORDER_SUBMITTED При успешном оформлении
	 */
	private async submitOrder(orderData: IOrderRequest): Promise<void> {
		this.eventEmitter.emit(AppEvents.ORDER_SENT);

		try {
			const response = await this.api.post('/order', orderData) as IOrderResponse;
			this.eventEmitter.emit(AppEvents.ORDER_SUBMITTED, response);
		} catch (error) {
			console.error('Failed to submit order:', error);
		}
	}
}