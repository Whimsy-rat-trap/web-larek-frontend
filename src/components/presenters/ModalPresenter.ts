import { AppEvents, StateEvents } from '../../types/events';
import { AppStateModel } from '../models/AppStateModel';
import { ModalView } from '../views/ModalView';
import { BasketView } from '../views/BasketView';
import { EventEmitter } from '../base/events';
import { ProductView } from '../views/ProductView';
import { OrderView } from '../views/OrderView';
import { ContactsModalView } from '../views/ContactsModalView';
import { SuccessView } from '../views/SuccessView';

export class ModalPresenter {
	constructor(
		private modalView: ModalView,
		private model: AppStateModel,
		private eventEmitter: EventEmitter,
		private basketView: BasketView,
		private productView: ProductView,
		private orderView: OrderView,
		private contactsView: ContactsModalView,
		private successView: SuccessView
	) {
		/**
		 * Подписка на открытие модального окна
		 * @listens AppEvents.MODAL_OPENED
		 */
		eventEmitter.on(
			AppEvents.MODAL_OPENED,
			(data: { type: string; productId?: string }) => {
				if (data.type === 'cart') {
					const content = this.basketView.render(
						this.model.state.basket,
						this.model.state.basketTotal
					);
					modalView.render(content);
				}
				if (data.type === 'product') {
					const product = model.state.catalog.find(
						(p) => p.id === data.productId
					);
					const inCart = this.model.state.basket.some(
						(p) => p.id === product.id
					);
					const content = this.productView.render(product, inCart);
					modalView.render(content);
				}
				if (data.type === 'order') {
					const content = this.orderView.render(
						this.model.state.order.payment,
						this.model.state.order.address,
						this.model.state.order.errors.filter(
							(error) => error.field === 'payment' || error.field === 'address'
						)
					);
					modalView.render(content);
				}
				if (data.type === 'contacts') {
					const content = this.contactsView.renderContactsForm();
					modalView.render(content);
				}
				if (data.type === 'success') {
					const total = this.model.state.basketTotal;
					const content = this.successView.render(total);
					modalView.render(content);
				}
			}
		);
		this.eventEmitter.on(StateEvents.ORDER_STATE_FORM_UPDATED, () => {
			const content = this.orderView.render(
				this.model.state.order.payment,
				this.model.state.order.address,
				this.model.state.order.errors.filter(
					(error) => error.field === 'payment' || error.field === 'address'
				)
			);
			modalView.render(content);
		});
	}
}
