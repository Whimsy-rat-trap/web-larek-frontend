import { AppStateModel } from '../models/AppStateModel';
import { SuccessModalView } from '../views/SuccessModalView';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';

export class SuccessPresenter {
	constructor(
		private view: SuccessModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
	){
		/**
		 * Подписка на событие открытия модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'success') {
				const total = model.basketTotal;
				this.view.renderSuccess(total);
			}
		});
	}
}