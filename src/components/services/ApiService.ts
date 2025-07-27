import { Api } from "../base/api";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";
import { AppEvents } from "../../types/events";
import { EventEmitter } from "../base/events";
import { AppState } from './AppState';

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
	/**
	 * Создает экземпляр ApiService
	 * @param {Api} api - Экземпляр API клиента
	 * @param events
	 * @param appState
	 */
	constructor(
		private api: Api,
		private events: EventEmitter,
		private appState: AppState // Инжектим сервис состояния
	) {
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для API сервиса
	 * @private
	 * @listens AppEvents.PAGE_MAIN_LOADED При загрузке главной страницы → вызывает loadProducts()
	 * @listens AppEvents.PRODUCT_DETAILS_REQUESTED При запросе деталей товара → вызывает loadProductDetails()
	 * @listens AppEvents.ORDER_READY При готовности заказа → вызывает submitOrder()
	 */
	private setupEventListeners(): void {
		this.events.on(AppEvents.PAGE_MAIN_LOADED, () => this.loadProducts());
		this.events.on(AppEvents.PRODUCT_DETAILS_REQUESTED, (data: { id: string }) =>
			this.loadProductDetails(data.id));
		// Изменяем слушатель - теперь слушаем ORDER_SUBMITTED вместо ORDER_READY
		this.events.on(AppEvents.ORDER_SUBMITTED, () => {
			const orderData = this.appState.state.order;
			const items = this.appState.state.basket.map(item => item.id);
			const total = this.appState.state.basket.reduce((sum, item) => sum + (item.price || 0), 0);

			this.submitOrder({
				...orderData,
				items,
				total
			} as IOrderRequest);
		});
	}

	/**
	 * Загружает список товаров с сервера
	 * @private
	 * @emits AppEvents.PRODUCTS_LIST_LOADED При успешной загрузке
	 */
	private async loadProducts(): Promise<void> {
		try {
			const response = await this.api.get('/product') as IProductListResponse;
			this.appState.catalog = response.items; // Сохраняем в состояние
		} catch (error) {
			console.error('Failed to load products:', error);
			this.appState.catalog = []; // Очищаем при ошибке
			// AppState сам отправит CATALOG_UPDATED с пустым массивом
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
			// Пытаемся найти в сохраненном каталоге
			const product = this.appState.state.catalog.find(p => p.id === productId);
			if (product) {
				this.events.emit(AppEvents.PRODUCT_DETAILS_LOADED, product);
				return;
			}

			// Если нет в каталоге - загружаем с сервера
			const response = await this.api.get(`/product/${productId}`) as IProduct;
			this.events.emit(AppEvents.PRODUCT_DETAILS_LOADED, response);
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
		this.events.emit(AppEvents.ORDER_SENT);

		try {
			const response = await this.api.post('/order', orderData) as IOrderResponse;
			this.events.emit(AppEvents.ORDER_SUBMITTED, response);
		} catch (error) {
			console.error('Failed to submit order:', error);
		}
	}
}