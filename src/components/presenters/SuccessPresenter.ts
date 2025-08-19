import { AppStateModel } from '../models/AppStateModel';
import { SuccessView } from '../views/SuccessView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';
import { IOrderResponse } from '../../types';

export class SuccessPresenter {
	constructor(
		private view: SuccessView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		/**
		 * Подписка на событие открытия модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(AppEvents.ORDER_SUBMITTED, (data: IOrderResponse) => {
			this.view.render(data.total);
		});
	}
}
