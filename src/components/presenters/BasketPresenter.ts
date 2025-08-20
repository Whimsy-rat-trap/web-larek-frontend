import { BasketView } from '../views/BasketView';
import { AppStateModel } from '../models/AppStateModel';
import { AppEvents, StateEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class BasketPresenter {
	constructor(
		private view: BasketView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		this.view.render(this.model.state.basket, this.model.state.basketTotal);

		/**
		 * Подписка на обновление корзины
		 * @listens AppEvents.BASKET_CONTENT_CHANGED
		 */
		this.eventEmitter.on(AppEvents.BASKET_CONTENT_CHANGED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});

		this.eventEmitter.on(AppEvents.BASKET_ITEM_ADDED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});

		this.eventEmitter.on(AppEvents.BASKET_ITEM_REMOVED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});

		this.eventEmitter.on(StateEvents.BASKET_STATE_CHANGED, () => {
			this.view.render(this.model.state.basket, this.model.state.basketTotal);
		});
	}
}
