import { AppStateModel } from '../models/AppStateModel';
import { ProductView } from '../views/ProductView';
import { EventEmitter } from '../base/events';
import { AppEvents } from '../../types/events';
import { IProduct } from '../../types';

export class ProductPresenter {
	constructor(
		private view: ProductView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		/**
		 * Подписка на загрузку данных товара
		 * @listens AppEvents.PRODUCT_DETAILS_LOADED
		 */
		this.eventEmitter.on(
			AppEvents.PRODUCT_DETAILS_LOADED,
			(product: IProduct) => {
				const inBasket = this.model.state.basket.some(
					(p) => p.id === product.id
				);
				this.view.render(product, inBasket);
			}
		);

		this.eventEmitter.on(
			AppEvents.BASKET_ITEM_ADDED,
			(productInfo: { id: string }) => {
				if (this.view.currentProductId === productInfo.id) {
					this.view.updateButtonState(this.view.currentProductId, true);
				}
			}
		);

		/**
		 * Подписка на обновление корзины для изменения состояния кнопки
		 * @listens AppEvents.BASKET_ITEM_REMOVED
		 */
		this.eventEmitter.on(
			AppEvents.BASKET_ITEM_REMOVED,
			(productInfo: { id: string }) => {
				if (this.view.currentProductId === productInfo.id) {
					this.view.updateButtonState(this.view.currentProductId, false);
				}
			}
		);
	}
}
