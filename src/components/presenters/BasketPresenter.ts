import { CartModalView } from '../views/CartModalView';
import { AppStateModel } from '../models/AppStateModel';
import { AppEvents } from '../../types/events';
import { EventEmitter } from '../base/events';
import { ModalView } from '../views/ModalView';

export class BasketPresenter {
	constructor(
		private view: CartModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
		private modalView: ModalView
	) {

		/**
		 * Подписка на обновление корзины
		 * @listens AppEvents.BASKET_CONTENT_CHANGED
		 */
		eventEmitter.on(AppEvents.BASKET_CONTENT_CHANGED, () => {
			const content = this.view.renderCart();
			if (this.modalView.container.classList.contains('modal_active') &&
				this.modalView.container.querySelector('.basket')) {
				this.modalView.render(content);
			}
		});

		/**
		 * Подписка на клик по кнопке оформления заказа
		 */
		eventEmitter.on(AppEvents.UI_ORDER_BUTTON_START_CLICKED, () => {
			eventEmitter.emit(AppEvents.MODAL_OPENED, { type: 'order' });
		});

		eventEmitter.on(AppEvents.BASKET_ITEM_REMOVED, () => {
			this.view.renderCart();
		});
	}
}