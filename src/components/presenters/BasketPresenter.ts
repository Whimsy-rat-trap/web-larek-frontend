import { BasketView } from '../views/BasketView';
import { AppStateModel } from '../models/AppStateModel';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class BasketPresenter {
	constructor(
		private view: BasketView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		/**
		 * Подписка на обновление корзины
		 * @listens AppEvents.BASKET_CONTENT_CHANGED
		 */
		this.eventEmitter.on(AppEvents.BASKET_CONTENT_CHANGED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});

		/**
		 * Подписка на клик по кнопке оформления заказа
		 */
		this.eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () => {
			eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'order' });
		});

		this.eventEmitter.on(AppEvents.BASKET_ITEM_REMOVED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});
	}
}
