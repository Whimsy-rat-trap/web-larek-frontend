import { CartModalView } from '../views/CartModalView';
import { AppStateModel } from '../models/AppStateModel';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class BasketPresenter {
	constructor(
		private view: CartModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	) {

		/**
		 * Подписка на обновление корзины
		 * @listens AppEvents.BASKET_UPDATED
		 */
		eventEmitter.on(AppEvents.BASKET_CONTENT_CHANGED, () => this.view.renderCart());
	}
}