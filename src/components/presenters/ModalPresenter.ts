import {AppEvents} from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';
import { CartModalView } from '../views/CartModalView';
import { EventEmitter } from '../base/events';
import { ProductModalView } from '../views/ProductModalView';
import { OrderModalView } from '../views/OrderModalView';

export class ModalPresenter {
	constructor(
		private modalView: ModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
		private basketView: CartModalView,
		private productView: ProductModalView,
		private orderView: OrderModalView,
	){

		/**
		 * Подписка на открытие модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(AppEvents.MODAL_OPENED, (data: { type: string, productId?: string }) => {
			if (data.type === 'cart') {
				const content =  this.basketView.renderCart();
				modalView.render(content);
			}
			if (data.type === 'product') {
				const product = model.state.catalog.find(p => p.id === data.productId);
				const content = this.productView.renderProduct(product);
				modalView.render(content);
			}
			if (data.type === 'order') {
				const content = this.orderView.renderOrderForm();
				modalView.render(content);
			}
		});
	}
}