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
		eventEmitter.on(AppEvents.PRODUCT_DETAILS_LOADED, (data: IProduct) => {
			const inCart = this.model.state.basket.some(p => p.id === data.id);
			this.view.renderProduct(data, inCart);
		});

		eventEmitter.on(AppEvents.BASKET_ITEM_ADDED, (productInfo: {id: string}) => {
			if (this.view.currentProductId === productInfo.id) {
				this.view.updateButtonState(this.view.currentProductId, true);
			}
		})

		/**
		 * Подписка на обновление корзины для изменения состояния кнопки
		 * @listens AppEvents.BASKET_ITEM_REMOVED
		 */
		eventEmitter.on(AppEvents.BASKET_ITEM_REMOVED, (productInfo: {id: string}) => {
			if (this.view.currentProductId === productInfo.id) {
				this.view.updateButtonState(this.view.currentProductId, false);
			}
		});
	}
}