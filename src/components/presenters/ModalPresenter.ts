import { AppEvents } from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';
import { EventEmitter } from '../base/events';

export type ModalViewList = {
	basketModalView: ModalView;
	productModalView: ModalView;
	orderModalView: ModalView;
	// contactsModalView: ModalView,
	// successModalView: ModalView,
};

export class ModalPresenter {
	constructor(
		private views: ModalViewList,
		private model: AppStateModel,
		private eventEmitter: EventEmitter
	) {
		/**
		 * Подписка на открытие модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(
			AppEvents.MODAL_OPENED,
			(data: { type: string; productId?: string }) => {
				// Закрываем все модальные окна перед открытием нового
				Object.values(this.views).forEach((view) => view.close());
				// Открываем требуемое модальное окно
				if (data.type === 'cart') {
					this.views.basketModalView.open();
				}
				if (data.type === 'product') {
					this.views.productModalView.open();
				}
				if (data.type === 'order') {
					this.views.orderModalView.open();
				}
				// if (data.type === 'contacts') {
				// 	const content = this.contactsView.renderContactsForm();
				// 	modalView.render(content);
				// }
				// if (data.type === 'success') {
				// 	const total = this.model.state.basketTotal;
				// 	const content = this.successView.render(total);
				// 	modalView.render(content);
				// }
			}
		);
	}
}
