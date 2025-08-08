import { Api } from "../base/api";
import { IProduct, IOrderRequest, IOrderResponse } from "../../types";
import { AppEvents } from "../../types/events";
import { EventEmitter } from "../base/events";
import { AppStateModel } from '../models/AppStateModel';

/**
 * Интерфейс ответа API для списка товаров
 * @interface IProductListResponse
 * @property {number} total - Общее количество товаров
 * @property {IProduct[]} items - Массив товаров
 */
interface IProductListResponse {
	total: number;
	items: IProduct[];
}

/**
 * Сервис для работы с API магазина
 * @class ApiService
 * @property {Api} api - Экземпляр API клиента
 * @property {EventEmitter} eventEmitter - Эмиттер событий приложения
 * @property {AppStateModel} appState - Состояние приложения
 */
export class ApiService {
	/**
	 * Создает экземпляр ApiService
	 * @param {Api} api - Экземпляр API клиента
	 * @param {EventEmitter} events - Эмиттер событий
	 * @param {AppStateModel} appState - Состояние приложения
	 */
	constructor(
		private api: Api,
		private events: EventEmitter,
		private appState: AppStateModel // Инжектим сервис состояния
	) {
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для API сервиса
	 * @private
	 * @listens AppEvents.PAGE_MAIN_LOADED - Загрузка главной страницы
	 * @listens AppEvents.PRODUCT_DETAILS_REQUESTED - Запрос деталей товара
	 * @listens AppEvents.ORDER_READY - Готовность заказа к отправке
	 */
	private setupEventListeners(): void {
		this.events.on(AppEvents.PAGE_MAIN_LOADED, () => this.loadProducts());
		this.events.on(AppEvents.PRODUCT_DETAILS_REQUESTED, (data: { id: string }) =>
			this.loadProductDetails(data.id));

		this.events.on(AppEvents.ORDER_READY, () => {
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
	 * @async
	 * @returns {Promise<void>}
	 * @emits AppEvents.PRODUCTS_LIST_LOADED - При успешной загрузке товаров
	 * @throws {Error} - При ошибке загрузки
	 */
	private async loadProducts(): Promise<void> {
		try {
			const response = await this.api.get('/product') as IProductListResponse;
			this.appState.catalog = response.items; // Сохраняем в состояние
		} catch (error) {
			console.error('Failed to load products:', error);
			this.appState.catalog = []; // Очищаем при ошибке
			// AppStateModal сам отправит CATALOG_UPDATED с пустым массивом
		}
	}

	/**
	 * Загружает детали конкретного товара
	 * @private
	 * @async
	 * @param {string} productId - ID товара
	 * @returns {Promise<void>}
	 * @emits AppEvents.PRODUCT_DETAILS_LOADED - При успешной загрузке деталей
	 * @throws {Error} - При ошибке загрузки
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
	 * @async
	 * @param {IOrderRequest} orderData - Данные заказа
	 * @returns {Promise<void>}
	 * @emits AppEvents.ORDER_SENT - При начале отправки
	 * @emits AppEvents.ORDER_SUBMITTED - При успешной отправке
	 * @emits AppEvents.ORDER_SUBMIT_ERROR - При ошибке отправки
	 * @throws {Error} - При ошибке отправки заказа
	 */
	private async submitOrder(orderData: IOrderRequest): Promise<void> {
		this.events.emit(AppEvents.ORDER_SENT);

		try {
			console.log('Submitting order:', orderData);
			const response = await this.api.post('/order', orderData) as IOrderResponse;
			this.events.emit(AppEvents.ORDER_SUBMITTED, response);
		} catch (error) {
			console.error('Failed to submit order:', error);

			// Публикуем событие об ошибке с деталями
			const errorMessage = error instanceof Error ? error.message : 'Ошибка при отправке заказа';
			this.events.emit(AppEvents.ORDER_SUBMIT_ERROR, {
				message: errorMessage
			});
		}
	}
}