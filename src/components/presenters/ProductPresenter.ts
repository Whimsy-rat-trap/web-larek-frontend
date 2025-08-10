import { AppStateModel } from '../models/AppStateModel';
import { ProductModalView } from '../views/ProductModalView';
import { EventEmitter } from '../base/events';
import { AppEvents } from '../../types/events';
import { IProduct } from '../../types';

export class ProductPresenter {
	constructor(
		private view: ProductModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	){
		/**
		 * Подписка на загрузку данных товара
		 * @listens AppEvents.PRODUCT_DETAILS_LOADED
		 */
		eventEmitter.on(AppEvents.PRODUCT_DETAILS_LOADED, (data: IProduct) =>
			this.view.renderProduct(data));

		/**
		 * Подписка на обновление корзины для изменения состояния кнопки
		 * @listens AppEvents.BASKET_UPDATED
		 */
		eventEmitter.on(AppEvents.BASKET_CONTENT_CHANGED, () => {
			if (this.view.currentProductId) {
				this.view.updateButtonState(this.view.currentProductId);
			}
		});
	}
}