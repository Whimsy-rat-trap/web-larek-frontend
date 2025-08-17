import {AppEvents} from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';
import { BasketView } from '../views/BasketView';
import { EventEmitter } from '../base/events';
import { ProductModalView } from '../views/ProductModalView';
import { OrderModalView } from '../views/OrderModalView';
import { ContactsModalView } from '../views/ContactsModalView';
import { SuccessModalView } from '../views/SuccessModalView';

export class ModalPresenter {
	constructor(
		private modalView: ModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
		private basketView: BasketView,
		private productView: ProductModalView,
		private orderView: OrderModalView,
		private contactsView: ContactsModalView,
		private successView: SuccessModalView
	){

		/**
		 * Подписка на открытие модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(
			AppEvents.MODAL_OPENED,
			(data: { type: string; productId?: string }) => {
				if (data.type === 'cart') {
					const content = this.basketView.render(this.model.state.basket, this.model.state.basketTotal);
					modalView.render(content);
				}
				if (data.type === 'product') {
					const product = model.state.catalog.find(
						(p) => p.id === data.productId
					);
					const inCart = this.model.state.basket.some(p => p.id === product.id)
					const content = this.productView.renderProduct(product, inCart);
					modalView.render(content);
				}
				if (data.type === 'order') {
					const content = this.orderView.renderOrderForm();
					modalView.render(content);
				}
				if (data.type === 'contacts') {
					const content = this.contactsView.renderContactsForm();
					modalView.render(content);
				}
				if (data.type === 'success') {
					const total = this.model.state.basketTotal;
					const content = this.successView.renderSuccess(total);
					modalView.render(content);
				}
			}
		);
	}
}