import { AppStateModel } from '../models/AppStateModel';
import { PageView } from '../views/PageView';
import { EventEmitter } from '../base/events';
import { StateEvents } from '../../types/events';
import { IProduct } from '../../types';

export class PagePresenter {

	constructor(
		private view: PageView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	){
		this.setupEventListeners();
	}

	/**
	 * Настраивает обработчики событий для главной страницы
	 * @private
	 * @listens StateEvents.CATALOG_UPDATED - При обновлении каталога товаров вызывает renderProducts()
	 * @listens StateEvents.BASKET_STATE_CHANGED - При обновлении корзины вызывает updateBasketCounter()
	 */
	private setupEventListeners(): void {
		this.eventEmitter.on(StateEvents.CATALOG_STATE_UPDATED,
			(data: { catalog: IProduct[] }) => this.view.renderProducts(data.catalog));
		this.eventEmitter.on(StateEvents.BASKET_STATE_CHANGED,
			(data: { basket: IProduct[] }) => this.view.updateBasketCounter(data.basket.length));
	}
}