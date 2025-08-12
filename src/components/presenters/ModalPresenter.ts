import {AppEvents} from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';
import { CartModalView } from '../views/CartModalView';
import { EventEmitter } from '../base/events';

export class ModalPresenter {
	constructor(
		private modalView: ModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
		private basketView: CartModalView,
	){

		/**
		 * Подписка на открытие модального окна корзины
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string }) => {
			if (data.type === 'cart') {
				const content =  this.basketView.renderCart();
				modalView.render(content);
			}
		});
	}
}